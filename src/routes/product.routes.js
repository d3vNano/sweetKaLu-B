import express from "express";

import {
    insertProduct,
    getProducts,
    getProduct,
} from "../controllers/product.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { productIdValidation } from "../middlewares/productIdValidation.middleware.js";

const router = express.Router();

router.use(authValidation);

//dev route
router.post("/products", insertProduct);

//client routes
router.get("/products", getProducts);
router.get("/products/:id", productIdValidation, getProduct);

export default router;
