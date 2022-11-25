import { addItemSchema } from "../models/cart.models.js";

export function addItemValidation(req, res, next) {
    const body = req.body;

    const { error } = addItemSchema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(message);
        res.status(422).send({ message });
        return;
    }
    req.stockToReserve = parseInt(body.stockToReserve);

    next();
}
