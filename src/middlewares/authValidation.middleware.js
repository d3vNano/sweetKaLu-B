import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export function authValidation(req, res, next) {
    dotenv.config();
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            console.log("Sem campo authorization");
            return res.sendStatus(401);
        }

        const parts = authorization.split(" ");
        const [schema, token] = parts;

        if (parts.length !== 2) {
            console.log("Authorization nao e valido");
            return res.sendStatus(401);
        }

        if (schema !== "Bearer") {
            console.log("Campo Bearer invalido");
            return res.sendStatus(401);
        }

        const user = jwt.verify(token, process.env.SECRET_JWT);
        res.locals.user = user;
    } catch {
        console.log("Erro JWT");
        return res.sendStatus(401);
    }

    next();
}
