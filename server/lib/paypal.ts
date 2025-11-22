import { PayPalClient, OrdersController } from "@paypal/paypal-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
const environment = process.env.PAYPAL_MODE === "live" ? "production" : "sandbox";

let client: PayPalClient | null = null;
let ordersController: OrdersController | null = null;

export function initializePayPal() {
  if (!clientId || !clientSecret) {
    console.warn("PayPal credentials not configured");
    return false;
  }

  try {
    client = new PayPalClient({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      environment,
    });

    ordersController = new OrdersController(client);
    console.log("PayPal initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize PayPal:", error);
    return false;
  }
}

export async function createPayPalOrder(amount: string, currency: string = "USD") {
  if (!ordersController) {
    throw new Error("PayPal not initialized");
  }

  try {
    const order = await ordersController.ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
    });

    return order.result;
  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  if (!ordersController) {
    throw new Error("PayPal not initialized");
  }

  try {
    const capture = await ordersController.ordersCapture({
      id: orderId,
    });

    return capture.result;
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    throw error;
  }
}

export function getPayPalClient() {
  return client;
}
