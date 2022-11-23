import chalk from "chalk";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
