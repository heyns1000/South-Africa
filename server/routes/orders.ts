import { Router } from "express";
import { db } from "../../db";
import { orders, orderItems, products } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createOrderSchema } from "@shared/schemas";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get user's orders
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.user!.id))
      .orderBy(orders.createdAt);

    res.json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    next(error);
  }
});

// Get single order with items
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.userId, req.user!.id)
        )
      )
      .limit(1);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    res.json({
      success: true,
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Calculate total and validate products
    let total = 0;
    const productData = [];

    for (const item of data.items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product with id ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ${product.name}`,
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      total += itemTotal;

      productData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId: req.user!.id,
        total: total.toFixed(2),
        status: "pending",
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
      })
      .returning();

    // Create order items
    const items = await db
      .insert(orderItems)
      .values(
        productData.map((item) => ({
          orderId: order.id,
          ...item,
        }))
      )
      .returning();

    // Update product stock
    for (const item of data.items) {
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    res.status(201).json({
      success: true,
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update order status (for payment confirmation)
router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status, paymentId } = req.body;

    const [order] = await db
      .update(orders)
      .set({
        status,
        paymentId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.userId, req.user!.id)
        )
      )
      .returning();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
