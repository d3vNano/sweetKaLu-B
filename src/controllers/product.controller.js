import chalk from "chalk";
import dayjs from "dayjs";

import {
    cartsCollection,
    productsCollection,
} from "../database/collections.js";

async function insertProduct(req, res) {
    const {
        image,
        name,
        shortDescription,
        description,
        price,
        stock,
        category,
        type,
    } = req.body;

    try {
        const product = await productsCollection.insertOne({
            image,
            name,
            shortDescription,
            description,
            price,
            stock,
            category,
            type,
        });

        res.sendStatus(201);
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
}

async function getProducts(req, res) {
    try {
        const products = await productsCollection.find().toArray();
        res.send(products);
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
}

async function getProduct(req, res) {
    const user = req.user;
    const product = req.product;

    try {
        const cartWithProduct = await cartsCollection.findOne({
            userId: user.id,
            "products._id": { $eq: product._id },
        });

        if (!cartWithProduct) {
            return res.send({ ...product, stockToReserve: 0 });
        }

        const productCart = cartWithProduct.products.find(
            (prod) => prod._id.toString() === product._id.toString()
        );

        res.send(productCart);
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
}

export { insertProduct, getProducts, getProduct };
