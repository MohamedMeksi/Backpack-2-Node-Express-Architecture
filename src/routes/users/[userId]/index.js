import { Router } from "express";

import routes from "./routes.js";
import productsRoutes from "./products/index.js";

const router = Router({ mergeParams: true });

router.use("/", routes);

router.use("/products", productsRoutes);

export default router;
