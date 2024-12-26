import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(
            colors.bgCyan.white(`db connected . Server running on ${mongoose.connection.host}`)
        );
    } catch (error) {
        console.log(colors.bgRed(`Failed to connect , Error : ${error}`));
    }
};

export {connectDb} ;