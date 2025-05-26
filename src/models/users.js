import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    mobileNumber: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});


export const User = mongoose.model('User', userSchema);
