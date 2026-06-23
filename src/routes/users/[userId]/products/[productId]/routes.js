import { Router } from "express";
import productServices from "#@/modules/product/services/index.js";

const router = Router({ mergeParams: true });

// GET /users/:userId/products/:productId - Get product by ID
router.get("/", async (req, res, next) => {
  try {
    const { productId } = req.params;

    const data = await productServices.fetchById({ id: productId });

    if (!data) {
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:userId/products/:productId - Delete product
router.delete("/", async (req, res, next) => {
  try {
    const { productId } = req.params;

    const data = await productServices.deleteById({ id: productId });

    if (!data) {
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// PUT /users/:userId/products/:productId - Update product
router.put("/", async (req, res, next) => {
  try {
    const { productId } = req.params;

    const data = await productServices.updateById({
      id: productId,
      payload: req.body,
    });

    if (!data) {
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
