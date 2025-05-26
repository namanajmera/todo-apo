import { User } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { createAsync } from "../utils/createAsync.js";

export const signUp = createAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("Name, email, and password are required", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    res.status(201).json({ data: user, message: "User created successfully" });
});