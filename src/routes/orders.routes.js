import { Router } from "express";
import { receiveOrder, closeOrder } from "../controllers/orders.controllers.js";
import { addressValidation } from "../middlewares/addressSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { checkOrderId } from "../middlewares/checkOrderId.middleware.js";
import { checkOrderStock } from "../middlewares/checkOrderStock.middleware.js";
import { checkSingleOpenCart } from "../middlewares/checkSingleOpenCart.middleware.js";
import { parseCartToOrder } from "../middlewares/parseCartToOrder.middleware.js";
import { updateUserAddress } from "../middlewares/updateUserAddress.middleware.js";
import { updateStock } from "../middlewares/updateStock.middleware.js";
import { idValidation } from "../middlewares/idValidation.middleware.js";

const router = Router();

router.use(authValidation);

router.get("/checkout/", checkSingleOpenCart, parseCartToOrder, receiveOrder);
router.post(
    "/checkout/:id",
    idValidation,
    addressValidation,
    updateUserAddress,
    checkOrderId,
    checkSingleOpenCart,
    checkOrderStock,
    updateStock,
    closeOrder
);
export default router;
