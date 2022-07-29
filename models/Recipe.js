const mongoose = require('mongoose');

// Création du shema de données et export du model
const recipeShema = mongoose.Schema({
    nom:{ type:String, required:true },
    ingredients:{ type:String, required:true },
    temps_discussion:{ type:String, required:true },
    difficulte:{ type:String, required:true },
    auteur:{ type:String, required:true }
})

module.exports = mongoose.model('Recipe',recipeShema);