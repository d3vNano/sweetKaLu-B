import dayjs from "dayjs";
import { cartsCollection } from "../database/collections.js";

export async function getCarts(req, res) {
    const cart = req.cart;

    try {
        if (!cart) {
            return res
                .status(400)
                .send({ message: "Carrinho em aberto não encontrado" });
        }

        cart.totalItens = 0;
        cart.subtotalPrice = 0;
        cart.products.forEach((e) => {
            cart.totalItens += e.stockToReserve;
            cart.subtotalPrice += e.price * e.stockToReserve;
        });

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function addCartItem(req, res) {
    const user = req.user;
    const cart = req.cart;
    const product = req.product;

    try {
        if (!product) {
            return res.sendStatus(500);
        }

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
                newProductsList[indexProductFind].stockToReserve =
                    product.stockToReserve;
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
                status: "opened",
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
            status: "opened",
        });
        if (!deletedCount) {
            return res.status(404).send({
                message:
                    "Nenhum carrinho em aberto encontrado para ser excluído",
            });
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
