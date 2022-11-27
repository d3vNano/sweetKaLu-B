import dayjs from "dayjs";

export async function parseCartToOrder(req, res, next) {
    const user = req.cart;

    try {
        if (!cart) {
            return res
                .status(400)
                .send({ message: "Usuário sem carrinho em aberto" });
        }

        const deliveryFee = 10;
        cart.totalItens = 0;
        cart.subtotalPrice = 0;
        cart.products.forEach((product) => {
            cart.totalItens += product.stockToReserve;
            cart.subtotalPrice += product.price * product.stockToReserve;
        });

        const totalPrice = cart.subtotalPrice + deliveryFee;

        const order = {
            userId: cart.userId,
            cartId: cart._id,
            subtotalPrice: cart.subtotalPrice,
            deliveryFee,
            totalPrice,
            totalItens: cart.totalItens,
            status: "processing",
        };
        req.order = order;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
