import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 6
    },
    profilePic:{
        type: String,
        default: ""
    },
    isLogged:{
        type: Boolean,
        default: false
    }
},
{ timestamps: true })

const User = mongoose.model("User", userSchema)

export default User