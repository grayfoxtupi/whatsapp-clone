import { app, io }  from './configs/serverConn.config.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import dbConn from './configs/dbConn.configs.js'
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT

app.use(cookieParser())

 app.use(cors({
     origin: ["http://localhost:3000","http://localhost:3001"],
     credentials: true
 }))

// app.use(cors({
//     origin: true,
//     creddentials: true
// }))

const apiPrefix = process.env.API_PREFIX

app.use("/api/auth", authRouter)
app.use("/api/message", messageRouter)


app.listen( PORT, () => {
    console.log("Project running on PORT = ", PORT)
    dbConn()
})