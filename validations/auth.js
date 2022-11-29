import { body } from 'express-validator'
import { validationHandler } from "../utils/index.js"

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('name', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
    validationHandler
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    validationHandler
]

