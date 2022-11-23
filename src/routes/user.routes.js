import { Router } from "express";
import { registerSchemaValidation } from "../middleware/registerSchemaValidation.middleware.js";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.post("/sign-up", registerSchemaValidation, registerUser);
export default router;
