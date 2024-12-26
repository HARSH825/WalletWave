import zod from 'zod';

const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
})


export {signupSchema};
