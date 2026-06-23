import { Router } from "express";
import mongoose from "mongoose";

import routes from "./routes.js";
import userIdRoutes from "./[userId]/index.js";

const router = Router({ mergeParams: true });

router.use("/", routes);

router.use("/:userId", validateObjectId, userIdRoutes);

function validateObjectId(req, _, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    next();
  } catch (error) {
    next(error);
  }
}

export default router;
