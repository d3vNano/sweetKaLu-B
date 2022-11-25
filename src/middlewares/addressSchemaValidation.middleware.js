import { addressSchema } from "../models/address.models.js";

export function addressValidation(req, res, next) {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send({ message: "Campo Address Necessário" });
    }

    const { error } = addressSchema.validate(address, { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(message);
        res.status(422).send({ message });
        return;
    }
    req.address = address;

    next();
}
