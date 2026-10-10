import { Router } from "express";
import { listMaterials, deleteMaterial } from "../controllers/materials.js";
import { listComments, createComment } from "../controllers/comments.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();
// Todas as rotas abaixo exigem um token válido.
router.use(authenticate);
// Admin e usuário podem consultar.
router.get("/", listMaterials);
// Comentários de um material.
router.get("/:id/comments", listComments);
router.post("/:id/comments", createComment);
// Apenas admin pode excluir.
router.delete("/:id", requireRole("admin"), deleteMaterial);
export default router;