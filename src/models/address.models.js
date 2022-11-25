import joi from "joi";

export const addressSchema = joi.object({
    address: joi.string().min(3).required(),
    number: joi.string().required(),
    city: joi.string().required(),
    postalCode: joi.string().min(3).required(),
});
