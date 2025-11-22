import { Router } from "express";
import { db } from "../../db";
import { products } from "../../db/schema";
import { eq, like, sql } from "drizzle-orm";
import { createProductSchema } from "@shared/schemas";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get all products with optional filtering
router.get("/", async (req, res, next) => {
  try {
    const { category, search, limit = "50", offset = "0" } = req.query;

    let query = db.select().from(products);

    // Apply category filter
    if (category && typeof category === "string") {
      query = query.where(eq(products.category, category)) as any;
    }

    // Apply search filter
    if (search && typeof search === "string") {
      query = query.where(
        sql`${products.name} ILIKE ${`%${search}%`} OR ${products.description} ILIKE ${`%${search}%`}`
      ) as any;
    }

    const allProducts = await query
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only - for now just requires auth)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);

    const [product] = await db
      .insert(products)
      .values(data)
      .returning();

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Update product (admin only - for now just requires auth)
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = createProductSchema.partial().parse(req.body);

    const [product] = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only - for now just requires auth)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const [product] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
