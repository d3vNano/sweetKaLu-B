import { cartsCollection, usersCollection } from "../database/collections.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import chalk from "chalk";
import dayjs from "dayjs";

export async function registerUser(req, res) {
    const { username, email, phone, password } = req.newUser;

    try {
        const passwordHash = bcrypt.hashSync(password, 10);
        const userInserted = await usersCollection.insertOne({
            username,
            email,
            phone,
            password: passwordHash,
        });

        const cartInserted = await cartsCollection.insertOne({
            userId: userInserted.insertedId.toString(),
            products: [],
        });

        await usersCollection.updateOne(
            { _id: userInserted.insertedId },
            { $set: { cartId: cartInserted.insertedId.toString() } }
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        res.sendStatus(500);
    }
}

export async function loginUser(req, res) {
    dotenv.config();
    const { email, password } = req.user;

    try {
        const userFind = await usersCollection.findOne({ email });

        if (!userFind) {
            return res.status(401).send({ message: "Usuário não cadastrado" });
        }

        if (userFind && bcrypt.compareSync(password, userFind.password)) {
            delete userFind.password;

            const generateToken = (id, username) =>
                jwt.sign({ id, username }, process.env.SECRET_JWT, {
                    expiresIn: "1d",
                });

            const token = generateToken(userFind._id, userFind.username);

            return res.send({
                id: userFind._id,
                username: userFind.username,
                token,
            });
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
