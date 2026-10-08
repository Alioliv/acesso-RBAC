import { Router } from "express";
import { listProducts } from "../controllers/products.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);
router.get("/", listProducts);
export default router;