const mongoose = require('mongoose');

// Création du shema de données et export du model
const thingShema = mongoose.Schema({
    title:{ type:String, required:true },
    description:{ type:String, required:true },
    imageUrl:{ type:String, required:true },
    userId:{ type:String, required:true },
    price:{ type:Number, required:true }
})

module.exports = mongoose.model('Thing',thingShema);