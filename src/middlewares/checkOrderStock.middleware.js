import chalk from "chalk";
import dayjs from "dayjs";
import { productsCollection } from "../database/collections.js";

export async function checkOrderStock(req, res, next) {
    const cart = req.cart;

    try {
        const currentProductsStock = await productsCollection
            .find({})
            .project({ stock: 1, name: 1 })
            .toArray();

        console.log(currentProductsStock);

        const cartProducts = [...cart.products];
        const currentCartProductsStock = [];
        const productToReviewStock = [];
        cartProducts.forEach((productCart) => {
            const productMatch = currentProductsStock.find(
                (p) => p._id.toString() === productCart._id.toString()
            );
            currentCartProductsStock.push(productMatch);
            if (productMatch.stock < productCart.stockToReserve) {
                productToReviewStock.push(productMatch);
            }
        });

        console.log(currentCartProductsStock);

        if (productToReviewStock.length > 0) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: insufficient stock at checkout"
                )
            );
            return res.status(409).send({
                message: `Houve um reajuste no estoque, reveja os produtos ${productToReviewStock.map(
                    (product) => product.name
                )}`,
            });
        }
        req.currentCartProductsStock = currentCartProductsStock;
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
    next();
}
