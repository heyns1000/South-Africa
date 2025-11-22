import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  image: z.string().url("Invalid image URL").optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
});

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().int().min(1),
  })).min(1, "Order must contain at least one item"),
  shippingAddress: z.string().min(10, "Shipping address is required"),
  paymentMethod: z.enum(["paypal", "payfast"]),
});

// Payment schemas
export const paypalCaptureSchema = z.object({
  orderId: z.string(),
  paypalOrderId: z.string(),
});

export const payfastNotifySchema = z.object({
  m_payment_id: z.string(),
  pf_payment_id: z.string(),
  payment_status: z.string(),
  item_name: z.string(),
  amount_gross: z.string(),
  amount_fee: z.string(),
  amount_net: z.string(),
  merchant_id: z.string(),
  signature: z.string(),
});
