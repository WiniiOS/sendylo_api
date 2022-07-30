const mongoose = require('mongoose');

const recipeShema = mongoose.Schema({
    nom:{ type:String, required:true },
    ingredients:{ type:String, required:true },
    temps_cuisson:{ type:String, required:true },
    difficulte:{ type:String, required:true,trim: true },
    auteur:{ type:String, required:true }
})

module.exports = mongoose.model('Recipe',recipeShema);