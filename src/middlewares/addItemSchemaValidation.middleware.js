import chalk from "chalk";
import dayjs from "dayjs";
import { addItemSchema } from "../models/cart.models.js";

export function addItemValidation(req, res, next) {
    const body = req.body;

    const { error } = addItemSchema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(
            chalk.magentaBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                "- BAD_REQUEST:",
                message
            )
        );
        return res.status(422).send({ message });
    }
    req.stockToReserve = parseInt(body.stockToReserve);

    next();
}
