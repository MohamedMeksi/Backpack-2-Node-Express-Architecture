import { Router } from "express";
import userServices from "#@/modules/user/services/index.js";

const router = Router({ mergeParams: true });

// GET /users/:userId - Get user by ID
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const data = await userServices.fetchById({ id: userId });

    if (!data) {
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:userId - Delete user
router.delete("/", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const data = await userServices.deleteById({ id: userId });

    if (!data) {
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// PUT /users/:userId - Update user
router.put("/", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const data = await userServices.updateById({
      id: userId,
      payload: req.body,
    });

    if (!data) {
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
