import chalk from "chalk";
import { ObjectId } from "mongodb";

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
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

async function getProducts(req, res) {
    try {
        const products = await productsCollection.find().toArray();
        res.send(products);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

async function getProduct(req, res) {
    const { id } = req.params;
    const user = req.user;
    try {
        const product = await productsCollection.findOne({
            _id: new ObjectId(id),
        });

        const cartUser = await cartsCollection.findOne({
            userId: user.id,
            status: "opened",
            "products._id": { $eq: new ObjectId(id) },
        });
        if (!cartUser) {
            return res.send({ ...product, stockToReserve: 0 });
        }

        const productCart = cartUser.products.find(
            (prod) => prod._id.toString() === id
        );
        res.send(productCart);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

export { insertProduct, getProducts, getProduct };
