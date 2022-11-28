import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        chalk.bold.cyan(
            `${dayjs().format(
                "YYYY-MM-DD HH:mm:ss"
            )} [Listening ON] Port: ${PORT}`
        )
    );
});
