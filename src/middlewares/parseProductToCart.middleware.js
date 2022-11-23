import { ObjectId } from "mongodb";
import { productsCollection } from "../database/collections.js";

export async function parseProductToCart(req, res, next) {
    const { id } = req.params;
    const quantity = req.quantity;

    try {
        const product = await productsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!product) {
            return res.status(404).send({ message: "Produto não encontrado" });
        }
        const productCart = { ...product, quantity };
        req.product = productCart;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
