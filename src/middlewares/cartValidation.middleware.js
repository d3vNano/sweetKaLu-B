import chalk from "chalk";
import dayjs from "dayjs";
import { cartsCollection } from "../database/collections.js";

export async function cartValidation(req, res, next) {
    const user = req.user;

    try {
        const cartArray = await cartsCollection
            .find({
                userId: user.id,
            })
            .toArray();

        if (cartArray.length !== 1) {
            console.log(
                chalk.bold.redBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- ERROR: multiply carts per user"
                )
            );
            return res.status(500).send({
                message:
                    "Error ao processar Carrinho!!! Lamentamos o ocorrido, Favor entre em contato com os Dev's ",
            });
        }
        req.cart = cartArray[0];
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
