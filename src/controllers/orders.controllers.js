import {
    cartsCollection,
    ordersCollection,
    usersCollection,
} from "../database/collections.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import chalk from "chalk";

export async function sendOrder(req, res) {
    const user = req.user;
    const order = req.order;
    const cart = req.cart;

    try {
        const orderFind = await ordersCollection.findOne({
            userId: user.id,
            status: "processing",
        });
        if (!orderFind && cart.products.length > 0) {
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
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
}

export async function closeOrder(req, res) {
    const { id } = req.params;
    const address = req.address;
    const user = req.user;
    const order = req.order;

    try {
        if (order.status === "confirmed") {
            console.log(
                chalk.greenBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- OK: status order confirmed"
                )
            );
            return res.status(202).send({
                message: "Seu pedido encontra-se confirmado",
            });
        }

        if (order.status === "delivery") {
            console.log(
                chalk.greenBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- OK: status order delivery"
                )
            );
            return res.status(202).send({
                message: "Seu pedido encontra-se em precedimento de entrega",
            });
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
            console.log(
                chalk.redBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- ERROR: status order don`t change to confirmed"
                )
            );
            return res.status(400).send({
                message: "Erro durante o processamento do Pedido de Compra",
            });
        }

        const cartFilter = { userId: user.id };
        const cartClean = {
            userId: user.id,
            products: [],
        };
        await cartsCollection.replaceOne(cartFilter, cartClean);

        res.send({
            message: "Pedido processado. Seu Pedido está confirmado",
        });
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
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
            console.log(
                chalk.redBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- ERROR: don`t found confirmed order"
                )
            );
            return res.status(400).send({
                message: "Não encontrado Pedido confirmado",
            });
        }

        const userFind = await usersCollection.findOne({
            _id: new ObjectId(user.id),
        });
        if (!userFind) {
            console.log(
                chalk.redBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- ERROR: user don`t fount do delivery order"
                )
            );
            return res.status(400).send({
                message: "Não encontrado usuário para entrega",
            });
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
