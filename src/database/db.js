import { MongoClient } from "mongodb";
import chalk from "chalk";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log(
        chalk.bold.green(
            dayjs().format("YYYY-MM-DD HH:mm:ss"),
            "[MongoDB Atlas] Connected!"
        )
    );
} catch (err) {
    console.log(chalk.red(err.message));
}

const db = mongoClient.db("sweetkalu");

export default db;
