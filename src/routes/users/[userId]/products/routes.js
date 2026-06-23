import { Router } from "express";
import productServices from "#@/modules/product/services/index.js";

const router = Router({ mergeParams: true });

// GET /users/:userId/products - Get all products
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { page: parseInt(page), limit: parseInt(limit) };

    const data = await productServices.fetchAll({ query });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /users/:userId/products - Create new product
router.post("/", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { name, quantity, price, total } = req.body;

    const payload = { userId, name, quantity, price, total };

    const data = await productServices.createOne({ payload });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
