import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createPayPalOrder, capturePayPalOrder } from "../lib/paypal";
import { createPayFastPayment, verifyPayFastSignature, getPayFastUrl } from "../lib/payfast";
import { paypalCaptureSchema, payfastNotifySchema } from "@shared/schemas";
import { db } from "../../db";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// PayPal routes
router.post("/paypal/create", requireAuth, async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(order.total, "USD");

    res.json({
      success: true,
      data: paypalOrder,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/paypal/capture", requireAuth, async (req, res, next) => {
  try {
    const data = paypalCaptureSchema.parse(req.body);

    // Capture PayPal payment
    const capture = await capturePayPalOrder(data.paypalOrderId);

    // Update order status
    await db
      .update(orders)
      .set({
        status: "paid",
        paymentId: data.paypalOrderId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(data.orderId)));

    res.json({
      success: true,
      data: capture,
    });
  } catch (error) {
    next(error);
  }
});

// PayFast routes
router.post("/payfast/create", requireAuth, async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const baseUrl = process.env.VITE_API_URL || "http://localhost:5000";

    // Create PayFast payment
    const paymentData = createPayFastPayment(
      order.total,
      `Order #${order.id}`,
      order.id.toString(),
      `${baseUrl}/api/payments/payfast/return`,
      `${baseUrl}/api/payments/payfast/cancel`,
      `${baseUrl}/api/payments/payfast/notify`
    );

    res.json({
      success: true,
      data: {
        url: getPayFastUrl(),
        paymentData,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PayFast ITN (Instant Transaction Notification) handler
router.post("/payfast/notify", async (req, res, next) => {
  try {
    const data = payfastNotifySchema.parse(req.body);

    // Verify signature
    const isValid = verifyPayFastSignature(req.body, data.signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid signature",
      });
    }

    // Update order status based on payment status
    if (data.payment_status === "COMPLETE") {
      await db
        .update(orders)
        .set({
          status: "paid",
          paymentId: data.pf_payment_id,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, parseInt(data.m_payment_id)));
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("PayFast notify error:", error);
    res.status(500).send("Error");
  }
});

// PayFast return URL (user redirected here after payment)
router.get("/payfast/return", async (req, res) => {
  const { orderId } = req.query;
  // Redirect to order confirmation page
  res.redirect(`/checkout/success?orderId=${orderId}`);
});

// PayFast cancel URL (user cancelled payment)
router.get("/payfast/cancel", async (req, res) => {
  const { orderId } = req.query;
  // Redirect to checkout page
  res.redirect(`/checkout?orderId=${orderId}&cancelled=true`);
});

export default router;
