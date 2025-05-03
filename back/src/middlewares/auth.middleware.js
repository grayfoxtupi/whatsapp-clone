import jwt from "jsonwebtoken";
import User from '../models/user.model.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! Token not found!" });
        }

        // ✅ Usando jwt.verify() em vez de bcrypt.compare()
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized! Invalid token sent" });
        }

        // 🔍 Buscar usuário no banco de dados
        const user = await User.findById(decodedToken.id).select("-password");

        if (!user) {
            console.log(decodedToken)
            return res.status(404).json({ message: "User not found!" });
        }

        req.user = user; // Armazena o usuário na requisição para as próximas funções

        console.log("User stored", req.user)

        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error on authentication" });
    }
};