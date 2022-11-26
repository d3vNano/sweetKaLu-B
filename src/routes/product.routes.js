import express from "express";
import {
    insertProduct,
    getProducts,
    getProduct,
} from "../controllers/product.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { idValidation } from "../middlewares/idValidation.middleware.js";

const router = express.Router();

router.use(authValidation);

//dev route
router.post("/products", insertProduct);

//client routes
router.get("/products", getProducts);
router.get("/products/:id", idValidation, getProduct);

export default router;
