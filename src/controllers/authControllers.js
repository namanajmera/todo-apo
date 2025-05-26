import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import { User } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { createAsync } from "../utils/createAsync.js";

const signToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.expiresIn,
    })
}
export const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        data: {
            token,
            user,
        },
    });
};

export const signUp = createAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("Name, email, and password are required", 400));
    }

    const existingUSer = await User.findOne({ email });
    if (existingUSer) {
        return next(new AppError("User with this email already exists", 400));
    }

    const newUser = await User.create({
        name,
        email,
        password,
    });

    createAndSendToken(newUser, 201, res);
});

export const login = createAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError("Invalid email.", 401));
    }
    if (!(await user.comparePassword(password, user.password))) {
        return next(new AppError("Invalid Password.", 401));
    }

    createAndSendToken(user, 200, res);

});