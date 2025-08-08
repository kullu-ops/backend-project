import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDb=async()=>{
try {
    const connectioninstance= await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
     console.log(`\nMongoDB Connected! DB Host: ${connectioninstance.connection.host}`);
} catch (error) {
    console.error("error",error)
    process.exit(1);
}
}
export default connectDb