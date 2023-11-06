const ctrl = {};
const { Image } = require ('../models')

ctrl.index = async (req, res) => {
   const images = await Image.find().sort({timestamp: -1}.lean);
   console.log(images.map(img => img.filename))
   res.render("index", { images: images.map(img => img.filename)})
}

module.exports = ctrl;