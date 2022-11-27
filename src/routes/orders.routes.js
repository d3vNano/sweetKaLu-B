import { Router } from "express";
import {
    sendOrder,
    closeOrder,
    confirmOrder,
} from "../controllers/orders.controllers.js";
import { addressValidation } from "../middlewares/addressSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { orderIdValidation } from "../middlewares/orderIdValidation.middleware.js";
import { checkOrderStock } from "../middlewares/checkOrderStock.middleware.js";
import { parseCartToOrder } from "../middlewares/parseCartToOrder.middleware.js";
import { updateUserAddress } from "../middlewares/updateUserAddress.middleware.js";
import { updateStock } from "../middlewares/updateStock.middleware.js";
import { cartValidation } from "../middlewares/cartValidation.middleware.js";

const router = Router();

router.use(authValidation, cartValidation);
router.get("/checkout/", parseCartToOrder, sendOrder);
router.post(
    "/checkout/:id",
    addressValidation,
    updateUserAddress,
    orderIdValidation,
    checkOrderStock,
    updateStock,
    closeOrder
);
router.get("/confirm/", confirmOrder);

export default router;
