import {
    cartsCollection,
    productsCollection,
    usersCollection,
    ordersCollection,
} from "../database/collections.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function receiveOrder(req, res) {
    const order = req.order;

    try {
        await ordersCollection.insertOne(order);
        res.send(order);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function closeOrder(req, res) {
    const user = req.user;
    const address = req.address;
    const cart = req.cart;

    try {
        const filterUser = {
            _id: new ObjectId(user.id),
        };

        await usersCollection.updateOne(filterUser, {
            $set: { address },
        });

        // Update stock
        cart.products.forEach(async (product) => {
            const filterProduct = { _id: product._id };
            if (product.stock !== "true") {
                const newStock = product.stock - product.stockToReserve;
                await productsCollection.updateOne(filterProduct, {
                    $set: { stock: newStock },
                });
            }
        });

        const order = {
            userId: user.id,
            cart,
            address,
            dateOrder: dayjs().format("DD-MM-YYYY HH:mm"),
        };
        const { insertedId } = await ordersCollection.insertOne(order);

        await cartsCollection.updateOne(
            { _id: cart._id },
            { $set: { status: "closed", orderId: insertedId } }
        );

        res.send(order);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
