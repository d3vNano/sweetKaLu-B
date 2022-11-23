import joi from "joi";

export const registerSchema = joi.object({
    username: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    phone: joi
        .string()
        .min(10)
        .max(11)
        .pattern(/^[0-9]+$/)
        .required(),
    password: joi.string().required().min(6).max(12),
    repeatPassword: joi.ref("password"),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(12),
});
