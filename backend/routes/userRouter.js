import express from 'express';
import { signupSchema } from '../validation/zod.js';
import { User } from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

//signup
router.post('/signup', async (req, res) => {
    try {
        const body = req.body;
        const result = signupSchema.safeParse(body);
        if (!result.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }

        const existingUser = await User.findOne({ 
            username: body.username  
        });

        if (existingUser) { // Check existence, not _id
            return res.status(409).json({ msg: "Username already taken" });
        }

        const dbUser = await User.create(body);
        const token = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECRET);

        return res.status(201).json({ 
            msg: "User created successfully",
            token 
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message }); 
    }
});

// router.get('/signin',(req,res)=>{

// })

export default router;