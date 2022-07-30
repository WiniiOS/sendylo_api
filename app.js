const express = require('express');
const app = express();
const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff');
const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://sendylo:administrateur@cuisinecluster.xgazwg2.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion des erreurs CORS,Types de requetes et headers
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS');
    next();
});

// extraire le corps JSON //body parser
app.use(express.json());

// On défini un routeur à chaque Base route
app.use('/api/stuff', stuffRoutes);
app.use('/api/v1/recipe', recipeRoutes);
// Enregistrement des routes d'authentification
app.use('/api/auth', userRoutes);


module.exports = app;