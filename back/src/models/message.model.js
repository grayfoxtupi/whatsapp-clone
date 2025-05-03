import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
}, {timestamp: true})

const Message = mongoose.model("Message", messageSchema)

export default Message