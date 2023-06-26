import chalk from "chalk";
import cors from "cors";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express from "express";

import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger.json" assert { type: "json" };

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const options = {
  explorer: true,
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(ordersRoutes);

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(
    chalk.bold.cyan(
      `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
    )
  );
});
