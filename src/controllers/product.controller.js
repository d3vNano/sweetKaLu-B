import chalk from "chalk";

import { productsCollection } from "../database/collections.js";

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

        res.status(201).send(product);
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

export { insertProduct, getProducts };
