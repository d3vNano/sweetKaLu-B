import chalk from "chalk";

export function idValidation(req, res, next) {
    const { id } = req.params;
    if (id.length !== 24) {
        console.log(chalk.red("WARN: Client send invalid ID"));
        return res.status(400).send({ message: "ID deve ter formato válido" });
    }
    next();
}
