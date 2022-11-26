import { productsCollection } from "../database/collections.js";

export async function updateStock(req, res, next) {
    const cart = req.cart;

    try {
        cart.products.forEach(async (product) => {
            const filterProduct = { _id: product._id };
            if (product.stock !== "true") {
                const newStock = product.stock - product.stockToReserve;
                if (newStock < 0) {
                    return res.status(409).send({
                        message: `Reveja a quantidade de ${product.name}. Stock atual: ${product.stock}`,
                    });
                }
                const { modifiedCount } = await productsCollection.updateOne(
                    filterProduct,
                    {
                        $inc: { stock: -Number(product.stockToReserve) },
                    }
                );
                if (!modifiedCount) {
                    console.log(
                        chalk.bold.red("Erro durante o atualização do Stock")
                    );
                    return res.status(400).send({
                        message: "Erro durante o atualização do Stock",
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
