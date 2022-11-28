import { Router } from "express";
import {
    cleanCart,
    getCart,
    updateCart,
} from "../controllers/cart.controllers.js";
import { addItemValidation } from "../middlewares/addItemSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { cartValidation } from "../middlewares/cartValidation.middleware.js";
import { productIdValidation } from "../middlewares/productIdValidation.middleware.js";
import { parseProductToCart } from "../middlewares/parseProductToCart.middleware.js";

const router = Router();

router.use(authValidation);
router.delete("/cart/", cleanCart);

router.use(cartValidation);
router.get("/cart", getCart);
router.put(
    "/cart/:id",
    addItemValidation,
    productIdValidation,
    parseProductToCart,
    updateCart
);
export default router;
