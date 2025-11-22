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

    let queryBuilder = db.select().from(products);

    // Apply category filter
    if (category && typeof category === "string") {
      queryBuilder = queryBuilder.where(eq(products.category, category)) as typeof queryBuilder;
    }

    // Apply search filter  
    if (search && typeof search === "string") {
      const searchTerm = `%${search}%`;
      queryBuilder = queryBuilder.where(
        sql`${products.name} ILIKE ${searchTerm} OR ${products.description} ILIKE ${searchTerm}`
      ) as typeof queryBuilder;
    }

    const allProducts = await queryBuilder
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
      .values({
        ...data,
        price: data.price.toFixed(2), // Convert number to string for decimal storage
      })
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

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Convert price to string if present
    if (data.price !== undefined) {
      updateData.price = data.price.toFixed(2);
    }

    const [product] = await db
      .update(products)
      .set(updateData)
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
