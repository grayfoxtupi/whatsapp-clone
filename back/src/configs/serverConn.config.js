import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }));  // Increase URL-encoded data size

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ["localhost:3000"]
    }
})

const usersSocketMap = {}

export const getUsersSocketMap = () => {
    return usersSocketMap
}

export const getReceiverSocket = (userId) => {
    return usersSocketMap[userId]
}

io.on('connection', (socket) => {
    console.log("user connected!")

    const userId = socket.handshake.query.userId

    if(userId)
        usersSocketMap[userId] = socket.id

    io.emit("getAllUsers", Object.keys(usersSocketMap))

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        delete usersSocketMap[userId]
        io.emit("getAllUsers", Object.keys(usersSocketMap))
    })
    
})

export { app, io, Server }