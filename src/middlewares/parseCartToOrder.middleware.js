import { ObjectId } from "mongodb";
import { cartsCollection } from "../database/collections.js";

export async function parseCartToOrder(req, res, next) {
    const { id } = req.params;
    const user = req.user;

    try {
        const cart = await cartsCollection.findOne({
            _id: new ObjectId(id),
            userId: user.id,
            status: "opened",
        });
        if (!cart) {
            return res.status(404).send({
                message: "Carrinho não encontrado ou pertence a outro usuário",
            });
        }

        cart.totalItens = 0;
        cart.subtotalPrice = 0;
        cart.products.forEach((e) => {
            cart.totalItens += e.stockToReserve;
            cart.subtotalPrice += e.price * e.stockToReserve;
        });

        const deliveryFee = 10;
        const totalPrice = cart.subtotalPrice + deliveryFee;

        const cartOrder = {
            deliveryFee,
            totalPrice,
            ...cart,
        };
        req.cart = cartOrder;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
