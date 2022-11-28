import { Router } from "express";
import {
    sendOrder,
    deliveryOrder,
    confirmOrder,
} from "../controllers/orders.controllers.js";
import { addressValidation } from "../middlewares/addressSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { orderIdValidation } from "../middlewares/orderIdValidation.middleware.js";
import { checkOrderStock } from "../middlewares/checkOrderStock.middleware.js";
import { parseCartToOrder } from "../middlewares/parseCartToOrder.middleware.js";
import { statusOrderValidation } from "../middlewares/statusOrderValidation.middleware.js";
import { updateUserAddress } from "../middlewares/updateUserAddress.middleware.js";
import { updateStock } from "../middlewares/updateStock.middleware.js";
import { cartValidation } from "../middlewares/cartValidation.middleware.js";

const router = Router();

router.use(authValidation);
router.get("/checkout/", cartValidation, parseCartToOrder, sendOrder);
router.post(
    "/checkout/:id",

    addressValidation,
    updateUserAddress,
    cartValidation,
    orderIdValidation,
    statusOrderValidation,
    checkOrderStock,
    updateStock,
    confirmOrder
);
router.get("/confirm/:id", orderIdValidation, deliveryOrder);

export default router;
