const ctrl = {};
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');
const { Image, Comment } = require('../models/index');
const image = require('../models/image');

ctrl.index = async (req, res) => {
    const image_id = req.params.image_id
    const image = await Image.findOne({ _id: image_id });

    if (image) {
        image.views = image.views + 1;
        await image.save();

        const comments = await Comment.find({ image_id: image._id })

        res.render('images', {
            titulo: image.titulo,
            descripcion: image.descripcion,
            filename: image.filename,
            views: image.views,
            likes: image.likes,
            image_id: image_id,
            comments: comments.map(comment => comment._doc)
        })
    } else {
        res.redirect('/')
    }
};


ctrl.create = (req, res) => {
    const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl })
        if (images.length > 0) {
            saveImage();
        } else {
            console.log(imgUrl);
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg'
                || ext === '.jfif' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImg = new Image({
                    titulo: req.body.titulo,
                    filename: imgUrl + ext,
                    descripcion: req.body.descripcion
                })
                const imageSave = await newImg.save();

                res.redirect("/images/" + imageSave._id);
            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: "Only Images are allowed" });
            }
        }
    };
    saveImage();
};

ctrl.like = async (req, res) => {
    const { image_id } = req.params
    try {
        const image = await Image.findOne({ _id: image_id })
        console.log(image);

        if (image) {
            image.likes = image.likes + 1;
            await image.save()

            res.json({ likes: image.likes })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno' })
    }
};

ctrl.comment = async (req, res) => {
    // received a comment and save self
    let comment = req.body
    console.log(comment);
    
    // const image = await Image.find({ filename: imgUrl })

    try {
        comment.gravatar = md5(comment.email);
        const new_comment = new Comment(comment);
        await new_comment.save()
        console.log(new_comment);

        res.redirect("/images/" + comment.image_id)
    } catch (error) {
        // console.log(error);
        // res.render("404")
    }
};

ctrl.remove = async (req, res) => {
    const { image_id } = req.params
    console.log(image_id);

    try {
        const image = await Image.findOne({ _id: image_id })
        console.log(image);

        if (image) {
            
            await Comment.deleteMany({ image_id });
            await Image.deleteOne({ _id: image_id })

            const img_deleted = await fs.unlink(path.resolve('./src/public/upload/' + image.filename));

            res.json(true);
        }
    } catch (error) {
        console.log(error);
    }
};


module.exports = ctrl;