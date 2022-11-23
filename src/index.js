import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);

dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
