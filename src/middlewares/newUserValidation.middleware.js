import chalk from "chalk";
import dayjs from "dayjs";
import { usersCollection } from "../database/collections.js";

export async function newUserValidation(req, res, next) {
    const newUser = req.newUser;
    try {
        const newUserFind = await usersCollection.findOne({
            email: newUser.email,
        });
        if (newUserFind) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: user already registered"
                )
            );
            return res.status(409).send({ message: "Usuário já cadastrado" });
        }
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
