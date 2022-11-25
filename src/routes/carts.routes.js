import { Router } from "express";
import {
    addCartItem,
    getCarts,
    removeCart,
} from "../controllers/carts.controllers.js";
import { addItemValidation } from "../middlewares/addItemSchemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { checkSingleOpenCart } from "../middlewares/checkSingleOpenCart.middleware.js";
import { parseProductToCart } from "../middlewares/parseProductToCart.middleware.js";

const router = Router();

router.use(authValidation);
router.delete("/carts/", removeCart);

router.use(checkSingleOpenCart);
router.get("/carts", getCarts);
router.post("/carts/:id", addItemValidation, parseProductToCart, addCartItem);
export default router;
