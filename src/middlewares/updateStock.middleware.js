import chalk from "chalk";
import dayjs from "dayjs";
import { productsCollection } from "../database/collections.js";

export async function updateStock(req, res, next) {
    const cart = req.cart;
    const order = req.order;

    try {
        if (order.status !== "process") {
            console.log(
                chalk.greenBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- ALERT: status order",
                    order.status
                )
            );
            return res.status(202).send({
                message: `Seu pedido encontra-se ${order.status}`,
            });
        }
        cart.products.forEach(async (product) => {
            if (product.stock !== "true") {
                const filterProduct = { _id: product._id };
                const { modifiedCount } = await productsCollection.updateOne(
                    filterProduct,
                    {
                        $inc: { stock: -Number(product.stockToReserve) },
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
