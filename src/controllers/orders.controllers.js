import { usersCollection } from "../database/collections.js";
import { ObjectId } from "mongodb";

export async function receiveOrder(req, res) {
    const user = req.user;
    const address = req.address;
    const cart = req.cart;

    console.log(cart);

    try {
        const filterUser = {
            _id: new ObjectId(user.id),
        };
        const userFinder = await usersCollection.updateOne(filterUser, {
            $set: { address },
        });

        const order = { userId: user.id, cart, address };

        console.log(userFinder);

        // await ordersCollection.updateOne({});

        res.send(address);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
