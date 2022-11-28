import chalk from "chalk";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { ordersCollection } from "../database/collections.js";

export async function orderIdValidation(req, res, next) {
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

        const order = await ordersCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!order) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: order not found"
                )
            );
            return res.status(404).send({ message: "Pedido inexistente" });
        }
        req.order = order;
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
