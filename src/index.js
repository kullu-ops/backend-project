
import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDb from "./db/main.js";
import { app } from "./app.js"; // ✅ Import app here

dotenv.config({ path: './.env' })
connectDb()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log("process is running",{})
    })
})
.catch((err)=>{
    console.log("mongo db connection failed!!!",err)
})


