export function checkOrderStock(req, res, next) {
    const cart = req.cart;

    try {
        if (!cart) {
            return res.status(404).send({
                message: "Carrinho não encontrado ou pertence a outro usuário",
            });
        }

        cart.totalItens = 0;
        cart.subtotalPrice = 0;
        const productToReviewStock = [];
        cart.products.forEach((product) => {
            if (product.stock < product.stockToReserve) {
                productToReviewStock.push(product);
            }
            cart.totalItens += product.stockToReserve;
            cart.subtotalPrice += product.price * product.stockToReserve;
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
