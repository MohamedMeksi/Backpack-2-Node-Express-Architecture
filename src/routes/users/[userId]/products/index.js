import { Router } from "express";
import mongoose from "mongoose";

import routes from "./routes.js";
import productIdRoutes from "./[productId]/index.js";

const router = Router({ mergeParams: true });

router.use("/", routes);

router.use("/:productId", validateObjectId, productIdRoutes);

function validateObjectId(req, _, next) {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }
    next();
  } catch (error) {
    next(error);
  }
}

export default router;
