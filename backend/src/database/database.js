import mongoose from "mongoose";
import DB_NAME from "../constant.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log("MongoDB Connection Error: ", error)
        throw error;
    }

}
export default connectDB;
