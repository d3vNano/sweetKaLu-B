import express from "express";
import {
    insertProduct,
    getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

//dev route
router.post("/products", insertProduct);

//client routes
router.get("/products", getProducts);

export default router;
