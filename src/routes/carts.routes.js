import { Router } from "express";
import { getCarts } from "../controllers/carts.controllers.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const router = Router();

router.get("/carts", authValidation, getCarts);
export default router;
