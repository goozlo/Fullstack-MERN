import mongoose from "mongoose"

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String
}, {
    timestamps: true
})

export const UserModel = mongoose.model('User', Schema)
