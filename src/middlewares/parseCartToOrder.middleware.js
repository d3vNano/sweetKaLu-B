import chalk from "chalk";
import dayjs from "dayjs";

export async function parseCartToOrder(req, res, next) {
    const DELIVERY_FEE = 10;
    const cart = req.cart;

    try {
        if (cart.products.length > 0) {
            const deliveryFee = DELIVERY_FEE;
            cart.totalItens = 0;
            cart.subtotalPrice = 0;
            cart.products.forEach((product) => {
                cart.totalItens += product.stockToReserve;
                cart.subtotalPrice += product.price * product.stockToReserve;
            });

            const totalPrice = cart.subtotalPrice + deliveryFee;

            const order = {
                userId: cart.userId,
                cartId: cart._id.toString(),
                subtotalPrice: cart.subtotalPrice,
                deliveryFee,
                totalPrice,
                totalItens: cart.totalItens,
                status: "processing",
            };
            req.order = order;
        } else {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: cart product empty"
                )
            );
            return res.status(409).send({
                message: "Carrinho encontra-se vazio",
            });
        }
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
    next();
}
