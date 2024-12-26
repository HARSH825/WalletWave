import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:12
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }

});

const User = mongoose.model('User',userSchema);

export {User};