import dayjs from "dayjs";

export async function parseCartToOrder(req, res, next) {
    const cart = req.cart;

    try {
        const deliveryFee = 10;
        const totalPrice = cart.subtotalPrice + deliveryFee;

        const order = {
            userId: cart.userId,
            cartId: cart._id,
            subtotalPrice: cart.subtotalPrice,
            deliveryFee,
            totalPrice,
            status: "processing",
            createdAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
        };
        req.order = order;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    next();
}
