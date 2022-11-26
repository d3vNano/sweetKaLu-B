import chalk from "chalk";
import dayjs from "dayjs";
import { cartsCollection } from "../database/collections.js";

export async function getCarts(req, res) {
    const cart = req.cart;

    try {
        if (!cart) {
            console.log(chalk.red("WARN: Carrinho em aberto não encontrado"));
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
            console.log(chalk.bold.red("Undefined product at addCartItem"));
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

            const filterCart = { userId: user.id, status: "opened" };
            const updateProductCarts = { $set: { products: newProductsList } };
            const { modifiedCount } = await cartsCollection.updateOne(
                filterCart,
                updateProductCarts
            );
            if (!modifiedCount) {
                console.log(chalk.red("WARN: Carrinho não foi atualizado"));
                return res.status(400).send({
                    message: "Erro durante o atualização do Carrinho",
                });
            }
            return res.sendStatus(204);
        } else {
            const insertDoc = {
                userId: user.id,
                products: [product],
                status: "opened",
                createdAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            };

            await cartsCollection.insertOne(insertDoc);
            return res.sendStatus(201);
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
            console.log(chalk.red("WARN: Carrinho não deletado"));
            return res.status(404).send({
                message: "Nenhum carrinho em aberto para ser excluído",
            });
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
