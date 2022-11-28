import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
import { registerSchemaValidation } from "../middlewares/registerSchemaValidation.middleware.js";
import { loginSchemaValidation } from "../middlewares/loginSchemaValidation.middleware.js";
import { newUserValidation } from "../middlewares/newUserValidation.middleware.js";

const router = Router();

router.post(
    "/sign-up",
    registerSchemaValidation,
    newUserValidation,
    registerUser
);
router.post("/sign-in", loginSchemaValidation, loginUser);
export default router;
