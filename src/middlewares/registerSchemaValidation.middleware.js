import { registerSchema } from "../models/users.models.js";

export function registerSchemaValidation(req, res, next) {
    const { username, email, phone, password, repeatPassword } = req.body;

    const newUser = { username, email, phone, password, repeatPassword };
    const { error } = registerSchema.validate(newUser, { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(message);
        res.status(422).send({ message });
        return;
    }
    delete newUser.repeatPassword;

    res.locals.newUser = newUser;

    next();
}
