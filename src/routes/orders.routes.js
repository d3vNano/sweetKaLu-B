import { Router } from "express";
import { receiveOrder } from "../controllers/orders.controllers.js";
import { addressValidation } from "../middlewares/addressSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { parseCartToOrder } from "../middlewares/parseCartToOrder.middleware.js";

const router = Router();

router.use(authValidation);

router.post("/checkout/:id", addressValidation, parseCartToOrder, receiveOrder);
export default router;
