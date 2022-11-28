import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import { UserModel } from "../models/User.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { password } = req.body
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            name: req.body.name,
            avatarUrl: req.body.avatarUrl,
            passwordHash: passHash
        })

        const user = await doc.save()
        const token = jwt.sign(
            { _id: user._id },
            'secret123',
            { expiresIn: '30d' }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            userData,
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            { _id: user._id },
            'secret123',
            { expiresIn: '30d' }
        )
        const { passwordHash, ...userData } = user._doc

        console.log(token)
        res.json({
            userData,
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc

        res.json(userData)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}
