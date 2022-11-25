import {
    cartsCollection,
    productsCollection,
    usersCollection,
    ordersCollection,
} from "../database/collections.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function receiveOrder(req, res) {
    const user = req.user;
    const address = req.address;
    const cart = req.cart;

    try {
        const filterUser = {
            _id: new ObjectId(user.id),
        };
        const userFinder = await usersCollection.updateOne(filterUser, {
            $set: { address },
        });

        // Upgrade stock
        cart.products.forEach(async (product) => {
            const filterProduct = { _id: product._id };
            if (product.stock !== "true") {
                const newStock = product.stock - product.quantity;
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

        await cartsCollection.deleteOne({ _id: cart._id });

        await ordersCollection.insertOne(order);

        res.send(order);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
