import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwtSecret: process.env.JWT_SECRET || "defaultSecretKey",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
}