const Recipe = require('../models/Recipe');

// externalisation de toutes nos routes dans le controlleur
exports.createRecipe = (req, res, next) => {
  const recipe = new Recipe({
    nom: req.body.nom,
    ingredients: req.body.ingredients,
    temps_cuisson: req.body.temps_cuisson,
    difficulte: req.body.difficulte,
    auteur: req.body.auteur
  });
  recipe.save().then(
    () => {
      res.status(201).json({
        message: 'Recipe saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneRecipe = (req, res, next) => {
  Recipe.findOne({
    _id: req.params.recipeid
  }).then(
    (recipe) => {
      res.status(200).json(recipe);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyRecipe = (req, res, next) => {
  const recipe = new Recipe({
    _id: req.params.recipeid,
    nom: req.body.nom,
    ingredients: req.body.ingredients,
    temps_cuisson: req.body.temps_cuisson,
    difficulte: req.body.difficulte,
    //auteur: req.body.auteur //non modifiable
  });
  Recipe.updateOne({_id: req.params.recipeid}, recipe).then(
    () => {
      res.status(201).json({
        message: 'Recipe updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteRecipe = (req, res, next) => {
    Recipe.deleteOne({_id: req.params.recipeid}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllRecipes = (req, res, next) => {
  Recipe.find().then(
    (recipes) => {
      res.status(200).json(recipes);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};