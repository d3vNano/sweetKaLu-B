import dayjs from "dayjs";
import { cartsCollection } from "../database/collections.js";

export async function getCarts(req, res) {
    const user = req.user;

    try {
        const cart = await cartsCollection.findOne({
            userId: user.id,
            status: "open",
        });

        if (!cart) {
            return res.status(400).send({ message: "Carrinho não encontrado" });
        }

        cart.totalItens = cart.products.length;
        cart.totalPrice = 0;
        cart.products.forEach((e) => {
            cart.totalPrice += e.price * e.quantity;
        });

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function addCartItem(req, res) {
    const user = req.user;
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
            const finderProduct = (e) => {
                return e._id.toString() === product._id.toString();
            };
            const productFind = cart.products.find((e) => finderProduct(e));
            const indexProductFind = cart.products.findIndex((e) =>
                finderProduct(e)
            );

            const newProductsList = [...cart.products];
            if (productFind) {
                newProductsList[indexProductFind].quantity += product.quantity;
            } else {
                newProductsList.push(product);
            }

            const filter = { userId: user.id };
            const updateDoc = { $set: { products: newProductsList } };
            await cartsCollection.updateOne(filter, updateDoc);
            res.sendStatus(204);
        } else {
            const insertDoc = {
                userId: user.id,
                products: [product],
                status: "open",
                date: dayjs().format("DD-MM-YYYY HH:mm"),
            };

            await cartsCollection.insertOne(insertDoc);
            res.sendStatus(201);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function removeCart(req, res) {
    const user = req.user;

    try {
        const { deletedCount } = await cartsCollection.deleteOne({
            userId: user.id,
            status: "open",
        });
        if (!deletedCount) {
            return res
                .status(404)
                .send({ message: "Nenhum carrinho encontrado" });
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
