import mongoose from 'mongoose'

import dotenv from 'dotenv'

dotenv.config()

const dbConn = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connection sucessed! ")
    }catch(error){
        console.log(error)
    }
}

export default dbConn