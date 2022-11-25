import chalk from "chalk";
import { cartsCollection } from "../database/collections.js";

export async function checkSingleOpenCart(req, res, next) {
    const user = req.user;

    try {
        const cartArray = await cartsCollection
            .find({
                userId: user.id,
                status: "opened",
            })
            .toArray();

        if (cartArray.length > 1) {
            console.log(
                chalk.bold.red(
                    "ERROR: Não deve haver mais de um Carrinho em aberto por usuário"
                )
            );
            return res.status(500).send({
                message:
                    "Error ao processar Carrinho!!! Lamentamos o ocorrido, Favor entre em contato com os Dev's ",
            });
        }
        [req.cart] = cartArray;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();
}
