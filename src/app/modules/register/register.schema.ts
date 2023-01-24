import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const registerCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'email must be a string'
    }).email(),
    name: z.string(),
};

const createRegisterSchema = z.object({
    ...registerCore,
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'password must be a string'
    }),
    password_resetToken: z.string().optional(),
    password_resetExpires: z.string().optional()
});

const createRegisterResponseSchema = z.object({
    id: z.number(),
    ...registerCore
});

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'email must be a string'
    }).email(),
    password: z.string()
})

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

export type CreateUserInput = z.infer<typeof createRegisterSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: registerSchemas, $ref } = buildJsonSchemas({
    createRegisterSchema,
    createRegisterResponseSchema,
    loginSchema,
    loginResponseSchema
});