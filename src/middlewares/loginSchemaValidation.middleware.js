import { loginSchema } from "../models/users.models.js";

export function loginSchemaValidation(req, res, next) {
    const { email, password } = req.body;
    const user = { email, password };

    const { error } = loginSchema.validate(user, { abortEarly: false });
    if (error) {
        const message = error.details.map((detail) => detail.message);
        console.log(message);
        res.status(422).send({ message });
        return;
    }
    res.locals.user = user;

    next();
}
