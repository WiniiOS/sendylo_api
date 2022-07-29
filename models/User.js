const mongoose = require('mongoose');

// Création du shema de données et export du model
const userShema = mongoose.Schema({
    email:{ type:String, required:true },
    password:{ type:String, required:true }
})

module.exports = mongoose.model('User',userShema);