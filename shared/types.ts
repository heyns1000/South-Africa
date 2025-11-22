import type { InferSelectModel } from "drizzle-orm";
import * as schema from "../db/schema";

// User types
export type User = InferSelectModel<typeof schema.users>;
export type InsertUser = typeof schema.users.$inferInsert;

// Product types
export type Product = InferSelectModel<typeof schema.products>;
export type InsertProduct = typeof schema.products.$inferInsert;

// Order types
export type Order = InferSelectModel<typeof schema.orders>;
export type InsertOrder = typeof schema.orders.$inferInsert;

// Order item types
export type OrderItem = InferSelectModel<typeof schema.orderItems>;
export type InsertOrderItem = typeof schema.orderItems.$inferInsert;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Payment types
export type PaymentMethod = "paypal" | "payfast";

export interface PaymentIntent {
  orderId: number;
  amount: number;
  method: PaymentMethod;
}

// Order with items
export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
}
