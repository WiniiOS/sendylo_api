const mongoose = require('mongoose');
const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user');
const config  = require('./config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const express = require('express');
const path = require('path');

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(config.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion des erreurs CORS,Types de requetes et headers
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    next();
});

// On rend statique notre dossier images
app.use('/images',express.static(path.join(__dirname,'images')));

// Swagger de documentation API
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// extraire le corps JSON //body parser
app.use(express.json());

// On défini un routeur à chaque route de base
app.use('/api/v1/recipe', recipeRoutes);
// Enregistrement des routes d'authentification
app.use('/api/v1/auth', userRoutes);


module.exports = app;