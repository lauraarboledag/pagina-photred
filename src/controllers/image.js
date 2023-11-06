const ctrl = {};
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const { Image } = require('../models/index');

ctrl.index = (req, res) => {

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
                //res.redirect('/images/:image_id'); (Esto es temporal)
                res.send('¡Está vivo!');

            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Algo ha salido mal, revisa el formato de la imagen o si es realmente una imagen.' })
            }
        }
    };
    saveImage();
};

ctrl.like = (req, res) => {

};

ctrl.comment = (req, res) => {

};

ctrl.remove = (req, res) => {

};


module.exports = ctrl;