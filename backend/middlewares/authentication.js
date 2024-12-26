//login

import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next)=>{
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer')){
        return res.json({msg:"Invalid credentials"});
    }

    const token = header.split(' ')[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }
        else{
            return res.json(404).json({msg:"Failed to verify User via token"});
        }
    }
    catch(err){
        console.log("Failed to decode , invalid credentials : "+err);
    }
}

//sgart here tomorroe