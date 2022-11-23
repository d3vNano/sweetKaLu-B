import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import productRoutes from "./routes/product.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
