import { User } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { createAsync } from "../utils/createAsync.js";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


export const getMe = createAsync(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
})

export const updateMe = createAsync(async (req, res, next) => {
    if (req.body.password) {
        return next(new AppError('This route is not for password updates. Please use /change-password', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'mobileNumber', 'dateOfBirth', 'profession');

    const user = req.user;

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        status: "success",
        data: {
            updatedUser,
        },
    });
})

export const deleteMe = createAsync(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    await User.findByIdAndDelete(user.id);
    res.clearCookie('token');

    res.status(204).json({
        status: "success",
        data: null,
    });
});