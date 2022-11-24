import {
    sessionsCollection,
    usersCollection,
} from "../database/collections.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

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

export async function loginUser(req, res) {
    dotenv.config();
    const { email, password } = res.locals.user;

    try {
        const userFind = await usersCollection.findOne({ email });

        if (!userFind) {
            return res.status(400).send({ message: "Usuario nao cadastrado" });
        }

        if (userFind && bcrypt.compareSync(password, userFind.password)) {
            delete userFind.password;

            const isUserLogged = await sessionsCollection.findOne({
                userId: userFind._id,
            });

            const generateToken = (id, username) =>
                jwt.sign({ id, username }, process.env.SECRET_JWT);

            let token = "";
            if (isUserLogged) {
                token = isUserLogged.token;
            } else {
                token = generateToken(userFind._id, userFind.username);
                await sessionsCollection.insertOne({
                    token,
                    userId: userFind._id,
                });
            }

            return res.send({
                id: userFind._id,
                username: userFind.username,
                email: userFind.email,
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

export async function logoutUser(req, res) {
    const user = res.locals.user;
    try {
        const { deletedCount } = await sessionsCollection.deleteOne({
            userId: new ObjectId(user.id),
        });
        if (!deletedCount) {
            return res
                .status(404)
                .send({ message: "Usuário já se encontrava deslogado" });
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
