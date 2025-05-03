import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../utils/cloudinary.js"
import { getReceiverSocket } from '../configs/serverConn.config.js'

export const getUsersForSideBar = async (req, res) => {
    try{
        const users = await User.find({ _id: {$ne: req.user.id} })
        return res.status(200).json(users)
    }catch(e){
        console.log(e)
        return res.status(500).json({ message: "Internal server error!"})

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, image } = req.body;

        if (!receiverId)
            return res.status(400).json({ message: "Bad request! Receiver ID is missing." });

        if (!(await User.findOne({ _id: receiverId })))
            return res.status(400).json({ message: "Bad request! The specified user doesn't exist." });

        let imageUrl = null;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        console.log("USER!!!!!!!: ", req.user)

        const message = await Message.create({
            userId: req.user.id,
            receiverId,
            text: text,
            image: imageUrl
        });

        // Handle socket communication separately to prevent errors affecting the response
        try {
            const receiverSocketId = getReceiverSocket(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", message);
            }
        } catch (socketError) {
            console.error("Socket error:", socketError);
        }

        return res.status(201).json({ message: "Created! Message sent successfully." });

    } catch (e) {
        let errorMessage = "Unknown error";

        if (e.response) {
            errorMessage = `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`;
        } else if (e.request) {
            errorMessage = "No response from the server.";
        } else {
            errorMessage = e.message;
        }

        console.error(errorMessage);
        return res.status(500).json({ message: "Internal server error!" });
    }
};


export const getChatMessages = async (req, res) => {
    try{

        const { receiverId } = req.params

        const messages = await Message.find( { $or: [
            { $and: [
                    { userId: req.user.id },
                    { receiverId: receiverId },
                ]
            },
            { 
                $and: [
                    { userId: receiverId },
                    { receiverId: req.user.id }
            ]
            }
        ]
        })

        console.log("MMM: ", messages)

        res.status(200).json({ 
            message: "OK! Messages founded",
            messages
        })
        
    }catch(e){
        let errorMessage = "Erro desconhecido";

        if (e.response) {
            errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
        } else if (e.request) {
            errorMessage = "Sem resposta do servidor.";
        } else {
            errorMessage = e.message;
        }

        console.error(errorMessage);
        return res.status(500).json({ message: "Internal server error!" })
    }
}


