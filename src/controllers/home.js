const ctrl = {};
const { Image } = require('../models')

ctrl.index = async (req, res) => {
   const images = await Image.find().sort({ timestamp: -1 }.lean);
   console.log(images.map(img => img._doc))
   res.render("index", { images: images.map(img => img._doc), list: [{ id: 1, name: "test" }, { id: 2, name: "test1" }] })
}

module.exports = ctrl;