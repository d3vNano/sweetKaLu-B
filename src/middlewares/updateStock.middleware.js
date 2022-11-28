import chalk from "chalk";
import dayjs from "dayjs";
import { productsCollection } from "../database/collections.js";

export async function updateStock(req, res, next) {
    const cart = req.cart;
    const currentCartProductsStock = req.currentCartProductsStock;

    try {
        cart.products.forEach(async (productCart) => {
            if (productCart.stock !== "true") {
                const filterProduct = { _id: productCart._id };
                const { modifiedCount } = await productsCollection.updateOne(
                    filterProduct,
                    {
                        $inc: { stock: -Number(productCart.stockToReserve) },
                    }
                );
                if (!modifiedCount) {
                    console.log(
                        chalk.magentaBright(
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            "- ERROR: stock update unsuccessful"
                        )
                    );
                    return res.status(400).send({
                        message: "Erro durante o atualização do Stock",
                    });
                }
            }
        });
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
