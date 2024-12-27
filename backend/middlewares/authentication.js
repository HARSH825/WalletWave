//login

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req,res,next)=>{
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer')){
        return res.status(411).json({msg:"Invalid credentials"});
    }

    const token = header.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.userId){
            req.userId = decoded.userId; //add userid in the request .
            next();
        }
        else{
            return res.status(403).json(404).json({msg:"Failed to verify User via token"});
        }
    }
    catch(err){
        console.log("Failed to decode  : "+err.message);
        return res.status(403).json({msg:"Invalid token, access denied"});
    }
}

export {authMiddleware};
//sgart here tomorroe