import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import { User } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { createAsync } from "../utils/createAsync.js";
import crypto from 'crypto';

const signToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.expiresIn,
    })
}
const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOPtions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
    res.cookie('token', token, cookieOPtions);
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

export const forgotPassword = createAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError("Email is required", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("User with this email does not exist", 404));
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;

    res.status(200).json({
        status: "success",
        message: "Reset token created successfully",
        resetURL,
    });

})

export const resetPassword = createAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        return next(new AppError("Token, password, and confirm password are required", 400));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError("Invalid or expired token", 400));
    }

    if (password !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createAndSendToken(user, 200, res);
})