import { usersCollection } from "../database/collections.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
    const { username, email, phone, password } = res.locals.newUser;

    try {
        const newUserFind = await usersCollection.findOne({ email });
        if (newUserFind) {
            return res.status(409).send({ message: "Usuário já cadastrado" });
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        await usersCollection.insertOne({
            username,
            email,
            phone,
            password: passwordHash,
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    res.sendStatus(201);
}
