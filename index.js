import express, { Router } from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation } from './validations/auth.js'
import { checkAuth } from "./utils/check-auth.js"
import * as UserController from "./controllers/user.controller.js"
import * as PostController from "./controllers/post.controller.js"
import { postCreateValidation } from "./validations/post.js";
import dotenv from 'dotenv'

dotenv.config()

mongoose
    .connect(process.env.DB_DATA || '')
    .then(() => console.log('Server connected to DB'))
    .catch(() => console.log('Server failed to connect to DB'))

const PORT = process.env.PORT || 4444
const app = express()

app.use(express.json())

const userRouter = Router()
userRouter.post('/login', ...loginValidation, UserController.login)
userRouter.post('/register', ...registerValidation, UserController.register)
userRouter.get('/me', checkAuth, UserController.getMe)

const postRouter = Router()
postRouter.post('/', checkAuth, ...postCreateValidation, PostController.create)
postRouter.get('/', PostController.getAll)
postRouter.get('/:id', PostController.getOne)
postRouter.patch('/:id', checkAuth, PostController.update)
postRouter.delete('/:id', checkAuth, PostController.remove)

app.use('/auth', userRouter)
app.use('/posts', postRouter)

app.listen(PORT, (error) => {
    if (error) {
        console.log(error.message)
    }
    console.log(`Server was started on http://localhost:${PORT}`)
})
