export function checkOrderStock(req, res, next) {
    const cart = req.cart;

    try {
        if (!cart) {
            return res.status(404).send({
                message: "Carrinho não encontrado ou pertence a outro usuário",
            });
        }

        // TODO: contabilizar estoque baseado no stock atual
        const productToReviewStock = [];
        cart.products.forEach((product) => {
            if (product.stock < product.stockToReserve) {
                productToReviewStock.push(product);
            }
        });

        if (productToReviewStock.length > 0) {
            res.status(409).send({
                message: `Houve um reajuste no Stock, reveja os produtos ${productToReviewStock.map(
                    (product) => product.name
                )}`,
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
