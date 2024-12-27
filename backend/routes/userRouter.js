import express from 'express';
import { signupSchema, updateSchema ,signInSchema} from '../validation/zod.js';
import { User } from '../models/userSchema.js';
import jwt, { sign } from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/authentication.js';

const router = express.Router();

// Signup
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

        if (existingUser) {
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

// Update
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const body = req.body;

        const result = updateSchema.safeParse(body);
        if (!result.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }

        const user = await User.updateOne(body, { id: req.userId });

        return res.status(200).json({ msg: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user: ", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

// Query DB
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: "i" } },
            { lastName: { $regex: filter, $options: "i" } }
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

// Signin
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = signInSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Invalid inputs" });
        }
        
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        return res.status(200).json({ 
            msg: "Login successful",
            token 
        });
    } catch (error) {
        console.error("Error during signin: ", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

export default router;
