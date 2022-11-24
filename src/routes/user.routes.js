import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { registerSchemaValidation } from "../middlewares/registerSchemaValidation.middleware.js";
import { loginSchemaValidation } from "../middlewares/loginSchemaValidation.middleware.js";

const router = Router();

router.post("/sign-up", registerSchemaValidation, registerUser);
router.post("/sign-in", loginSchemaValidation, loginUser);
export default router;
