import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { signupSchema, loginSchema, updateProfileSchema } from "@shared/schemas";
import { requireAuth } from "../middleware/auth";
import type { User } from "@shared/types";

const router = Router();

// Configure passport local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // SECURITY WARNING: Plain text password comparison is used for development only
        // CRITICAL TODO: Before production, implement bcrypt password hashing:
        // 1. Install bcrypt: npm install bcrypt @types/bcrypt
        // 2. Hash passwords on registration: const hash = await bcrypt.hash(password, 10)
        // 3. Compare on login: const isValid = await bcrypt.compare(password, user.password)
        // This is a CRITICAL security vulnerability that MUST be fixed before deployment
        if (user.password !== password) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return done(null, false);
    }

    done(null, {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    done(error);
  }
});

// Register route
router.post("/register", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // SECURITY WARNING: Storing plain text passwords for development only
    // CRITICAL TODO: Before production, hash passwords with bcrypt:
    // const hashedPassword = await bcrypt.hash(data.password, 10)
    // This is a CRITICAL security vulnerability that MUST be fixed before deployment
    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password, // Should be: hashedPassword
        name: data.name,
      })
      .returning();

    // Log the user in
    req.login(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      (err) => {
        if (err) {
          return next(err);
        }

        res.json({
          success: true,
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: info?.message || "Invalid credentials",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.json({
        success: true,
        data: user,
      });
    });
  })(req, res, next);
});

// Logout route
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

// Get current user
router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// Update profile
router.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user!.id))
      .returning();

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
