import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createToken = (id, response) => {
    // Corrected: Use expiresIn instead of expires
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Use `expiresIn` here
    })

    response.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development' // Secure cookies in non-development environments
    })

}
