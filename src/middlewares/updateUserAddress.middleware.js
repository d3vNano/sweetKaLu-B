import { ObjectId } from "mongodb";
import { usersCollection } from "../database/collections.js";

export async function updateUserAddress(req, res, next) {
    const user = req.user;
    const address = req.address;

    try {
        const filterUser = {
            _id: new ObjectId(user.id),
        };

        await usersCollection.updateOne(filterUser, {
            $set: { address },
        });
    } catch (error) {
        console.log(
            chalk.redBright(
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                error.message
            )
        );
        return res.sendStatus(500);
    }
    next();
}
