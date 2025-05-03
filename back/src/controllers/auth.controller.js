import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import cloudinary from '../utils/cloudinary.js'
import { app, io, Server, getUsersSocketMap } from '../configs/serverConn.config.js'
import { createToken } from '../utils/tokens.js' 

dotenv.config()


export const signUp = async (req, res) => {
    const {email, fullName, password} = req.body

    try{
        const existingUser = await User.findOne({ email: email })

        if(!existingUser) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new User({
                email: email,
                fullname: fullName,
                password: hashedPassword
            })

            createToken(newUser._id, res)
            const response = await newUser.save()
            return res.status(201).json({ message: "User sign-up successfully!", user: response })

        }else{
            console.log(existingUser)
            return res.status(409).json({
                message: "User sign-up failled!",
            })
        }

    }catch(e){
        let errorMessage = "Erro desconhecido";

        if (e.response) {
            errorMessage = `Erro ${e.response.status}: ${JSON.stringify(e.response.data)}`;
        } else if (e.request) {
            errorMessage = "Sem resposta do servidor.";
        } else {
            errorMessage = e.message;
        }

        return res.status(400).json(errorMessage)
    }
    
}

export const logIn = async (req, res) => {
    const { email, password } = req.body

    if( !email || !password ) {
        return res.status(400).json({ message: "Bad Request! Required fields are missing."})
    }

    try{

    const user = await User.findOne({ email })

    if(!user) {
        return res.status(400).json({ message: "Bad Request! User not found."})
    }

    if(!(await bcrypt.compare(password, user.password))){
        return res.status(400).json("Bad Request! Wrong password.")
    }

    createToken(user._id, res)

    return res.status(200).json({
        message: "Login efetuado com sucesso!",
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt
        },
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

        return res.status(500).json(errorMessage)
    }

}

export const logOut = (req, res) => {
    try{
        res.cookie("token", "", {maxAge: 0})
        res.status(200).json("Tokens cleared sucessfully!")
    }catch(e){
        res.status(500).json({ message: ` Internal server error on logout! ${e.message}`})
    }
}

export const update = async (req, res) => {
    try{
        const { profilePic } = req.body

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        console.log("UPLOAD RESPONSE", uploadResponse)

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {profilepic: uploadResponse.secure_url},
            {new: true} // Retorna o documento atualizado (por padrão retornaria o antigo)
        )

        console.log("updated user: ", updatedUser)

        res.status(201).json(updatedUser)

    }catch(e){
        console.log(e.message)
        return res.status(500).json({message:"Internal server error!"})
    }
}

export const checkUser = (req, res) => {
    try{
        return res.status(200).json(req.user)
    }catch(e){
        return res.status(500).json("Internal server error! User logged out!")
    }
} 

