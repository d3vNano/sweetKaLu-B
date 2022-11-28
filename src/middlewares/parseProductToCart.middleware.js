import chalk from "chalk";
import dayjs from "dayjs";

export async function parseProductToCart(req, res, next) {
    const product = req.product;
    const stockToReserve = req.stockToReserve;

    try {
        if (product.stock < stockToReserve) {
            console.log(
                chalk.magentaBright(
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    "- BAD_REQUEST: insufficient stock"
                )
            );
            return res
                .status(409)
                .send({ message: "Quantidade deve ser menor do que estoque" });
        }

        const productCart = { ...product, stockToReserve };
        req.productCart = productCart;
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
