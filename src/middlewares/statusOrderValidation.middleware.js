import chalk from "chalk";
import dayjs from "dayjs";

export function statusOrderValidation(req, res, next) {
    const order = req.order;

    if (order.status !== "processing") {
        console.log(
            chalk.magentaBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                "- BAD_REQUEST: status order",
                order.status
            )
        );
        return res.status(409).send({
            message: `Seu pedido encontra-se ${order.status}`,
        });
    }
    next();
}
