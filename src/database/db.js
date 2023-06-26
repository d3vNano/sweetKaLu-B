import chalk from "chalk";
import dayjs from "dayjs";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

mongoClient
  .connect()
  .then(() => {
    console.log(
      chalk.bold.green(
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        "[MongoDB Atlas] Connected!"
      )
    );
  })
  .catch((err) => {
    console.error(chalk.red(err.message));
    console.log(err);
  });

const db = mongoClient.db(process.env.MONGO_DATABASE);

export default db;
