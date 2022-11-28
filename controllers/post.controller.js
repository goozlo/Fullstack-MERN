import { PostModel } from "../models/Post.js"

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        PostModel
            .findOneAndUpdate(
                { _id: req.params.id },
                { $inc: { viewsCount: 1 } },
                { returnDocument: 'after' },
                (error, doc) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json({
                            message: 'Не удалось найти статью'
                        })
                    }

                    if (!doc) {
                        return res.status(404).json({
                            message: 'Не удалось найти статью'
                        })
                    }

                    res.json(doc)
                }
            )
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        PostModel.findOneAndDelete({ _id: req.params.id }, {}, (error, doc) => {
            if (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Не удалось найти статью'
                })
            }

            res.json({ success: true })
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        await PostModel.updateOne({
            _id: req.params.id
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        res.json({ success: true })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}
