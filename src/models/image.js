const mongoose = require('mongoose');
const {Schema} = mongoose;
const path = require ('path');

const ImageSchema = new Schema({
    titulo: {type: String},
    descripcion: {type: String},
    filename: {type: String},
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now}
})

ImageSchema.virtual('uniqueId')
.get (function(){
    return this.filename.replace(path.extname(this.filename), '')
});

module.exports = mongoose.model('Image', ImageSchema);