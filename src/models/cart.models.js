import joi from "joi";

export const addItemSchema = joi.object({
    stockToReserve: joi.number().integer().min(0).required(),
});
