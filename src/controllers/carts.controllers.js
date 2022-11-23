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
            return res.status(400).send("Carrinho não encontrado");
        }

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
