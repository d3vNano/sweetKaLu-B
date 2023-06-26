import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

function restoreDB() {
  const MONGO_URI = process.env.MONGO_URI;
  const DATABASE = process.env.MONGO_DATABASE;
  const DUMP_PATH = "./dump";

  exec(
    `sh restore.sh ${MONGO_URI} ${DATABASE} ${DUMP_PATH}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o arquivo: ${error}`);
        return;
      }
      console.log(`Restore '${MONGO_URI}' '${DATABASE}' OK!!!`);
    }
  );
}

restoreDB();
