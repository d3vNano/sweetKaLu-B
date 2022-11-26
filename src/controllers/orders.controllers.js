import {
    cartsCollection,
    ordersCollection,
    usersCollection,
} from "../database/collections.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import chalk from "chalk";

export async function receiveOrder(req, res) {
    const user = req.user;
    const order = req.order;

    try {
        const orderFind = await ordersCollection.findOne({
            userId: user.id,
            status: "processing",
        });
        if (!orderFind) {
            const { insertedId } = await ordersCollection.insertOne({
                ...order,
                createdAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            });
            return res.send({ ...order, _id: insertedId });
        } else {
            const orderFilter = {
                userId: user.id,
                status: "processing",
            };
            await ordersCollection.updateOne(orderFilter, { $set: order });
            return res.send({ ...order, _id: orderFind._id });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function closeOrder(req, res) {
    const { id } = req.params;
    const address = req.address;
    const cart = req.cart;

    try {
        if (!cart) {
            return res
                .status(400)
                .send({ message: "Usuário sem Pedido em aberto" });
        }

        const orderFilter = {
            _id: new ObjectId(id),
            status: "processing",
        };
        const orderUpdate = {
            $set: {
                address: address,
                status: "confirmed",
                processedAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            },
        };
        const { modifiedCount } = await ordersCollection.updateOne(
            orderFilter,
            orderUpdate
        );
        if (!modifiedCount) {
            return res.status(400).send({
                message: "Erro durante o processamento do Pedido de Compra",
            });
        }

        const cartFilter = {
            _id: cart._id,
            status: "opened",
        };
        const cartUpdate = {
            $set: {
                status: "closed",
                orderId: id,
                closedAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            },
        };
        const { matchedCount } = await cartsCollection.updateOne(
            cartFilter,
            cartUpdate
        );
        if (!matchedCount) {
            return res.status(400).send({
                message: "Erro durante o atualização do status do Carrinho",
            });
        }

        res.send({
            message:
                "Pedido processado. Seu Pedido está procedimento de entrega.",
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function confirmOrder(req, res) {
    const user = req.user;
    try {
        const orderConfirmed = await ordersCollection.findOne({
            userId: user.id,
            status: "confirmed",
        });
        if (!orderConfirmed) {
            return res
                .status(400)
                .send({ message: "Nenhum Pedido com com status confirmado" });
        }

        const userFind = await usersCollection.findOne({
            _id: new ObjectId(user.id),
        });
        console.log(userFind);
        if (!userFind) {
            console.log(
                chalk.bold.red("ERROR: Inconsistency with Order -> User ")
            );
            return res.sendStatus(500);
        }

        const resObject = {
            orderNo: orderConfirmed._id,
            deliveryAddress: orderConfirmed.address,
            username: userFind.username,
            phone: userFind.phone,
            email: userFind.email,
        };

        await ordersCollection.updateOne(
            { _id: orderConfirmed._id },
            { $set: { status: "delivery" } }
        );

        res.send(resObject);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
