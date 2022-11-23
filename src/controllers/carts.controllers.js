import dayjs from "dayjs";
import { cartsCollection } from "../database/collections.js";

export async function getCarts(req, res) {
    const { username, id } = res.locals.user;
    const user = { username, userId: id };

    try {
        const cart = await cartsCollection.findOne({
            userId: user.userId,
            status: "open",
        });

        if (!cart) {
            return res.status(400).send({ message: "Carrinho não encontrado" });
        }

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function addCartItem(req, res) {
    const user = res.locals.user;
    const product = req.product;

    try {
        if (!product) {
            return res.sendStatus(500);
        }

        const cart = await cartsCollection.findOne({
            userId: user.id,
            status: "open",
        });

        if (cart) {
            const filter = { userId: user.id };
            const updateDoc = { $push: { products: product } };
            console.log(cart);
            await cartsCollection.updateOne(filter, updateDoc);
            res.sendStatus(204);
        } else {
            const insertDoc = {
                userId: user.id,
                products: [product],
                status: "open",
                date: dayjs().format("DD-MM-YYYY HH:mm"),
            };

            console.log(insertDoc);
            await cartsCollection.insertOne(insertDoc);
            res.sendStatus(201);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
