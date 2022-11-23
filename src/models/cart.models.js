import joi from "joi";

export const addItemSchema = joi.object({
    quantity: joi.number().integer().greater(0).required(),
});
