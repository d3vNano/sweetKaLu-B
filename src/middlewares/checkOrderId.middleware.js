import chalk from "chalk";
import { ObjectId } from "mongodb";
import { ordersCollection } from "../database/collections.js";

export async function checkOrderId(req, res, next) {
    const { id } = req.params;

    try {
        const orderFind = await ordersCollection.findOne({
            _id: new ObjectId(id),
            status: "processing",
        });

        if (!orderFind) {
            console.log(
                chalk.red("WARN: Pedido em processamento não encontrado")
            );
            return res
                .status(400)
                .send({ message: "Pedido em processamento não encontrado" });
        }
        req.orderFind = orderFind;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
