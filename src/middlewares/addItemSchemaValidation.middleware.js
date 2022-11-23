import { addItemSchema } from "../models/cart.models.js";

export function addItemValidation(req, res, next) {
    const quantity = req.body;

    const { error } = addItemSchema.validate(quantity, { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(message);
        res.status(422).send({ message });
        return;
    }
    req.quantity = parseInt(quantity.quantity);

    next();
}
