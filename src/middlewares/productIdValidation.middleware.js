import chalk from "chalk";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { productsCollection } from "../database/collections.js";

export async function productIdValidation(req, res, next) {
    const { id } = req.params;

    try {
        if (id.length !== 24) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: invalid id"
                )
            );
            return res
                .status(400)
                .send({ message: "ID deve ter formato válido" });
        }

        const product = await productsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!product) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: product not found"
                )
            );
            return res.status(404).send({ message: "Produto inexistente" });
        }
        req.product = product;
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
