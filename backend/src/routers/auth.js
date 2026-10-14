import { Router } from "express";
import { register } from "../controllers/register.js";
import { login } from "../controllers/auth.js";
import { loginRateLimit } from "../middleware/loginRateLimit.js";

const router = Router();

// ==> LOGIN SEM O RATE LIMIT 
// Login ? p?blico: o aluno ainda n?o possui um token.
// router.post("/login", login);

// ==> LOGIN COM O RATE LIMIT <== 
router.post("/login", loginRateLimit, login);

// Cadastro também é público: ainda não existe uma sessão.
router.post("/register", register);
export default router;
