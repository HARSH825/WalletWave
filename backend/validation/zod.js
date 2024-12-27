import zod from 'zod';

const signupSchema = zod.object({
    username:zod.string().min(1),
    password:zod.string().min(6),
    firstName:zod.string().min(1),
});

const updateSchema = zod.object({
    firstName:zod.string().optional(),
    lastName: zod.string().optional(),
    password:zod.string().optional()
});

const signInSchema = zod.object({
    username:zod.string().min(1),
    password:zod.string().min(6),
});
export {signupSchema,updateSchema, signInSchema};
