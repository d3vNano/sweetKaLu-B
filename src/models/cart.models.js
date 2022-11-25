import joi from "joi";

export const addItemSchema = joi.object({
    stockToReserve: joi.number().integer().greater(0).required(),
});
