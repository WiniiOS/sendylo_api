const Recipe = require('../models/Recipe');

// externalisation de toutes nos routes dans le controlleur
exports.createRecipe = (req, res, next) => {

  const userId = req.auth.userId;

  if (req.body.nom !== "") {
    
    const recipe = new Recipe({
      nom: req.body.nom,
      ingredients: req.body.ingredients,
      temps_cuisson: req.body.temps_cuisson,
      difficulte: req.body.difficulte,
      auteur: userId
    });
    recipe.save().then(
      () => {
        res.status(201).json({
          message: 'Recipe saved successfully!',
          recette: recipe
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );

  }else{
    res.status(401).json({
      message: "The path 'nom' can't be empty"
    });
  }
  
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
    difficulte: req.body.difficulte
  });

  const currentUser = req.auth.userId;
  // On check si notre user est l'auteur de la recette.
  Recipe.findOne({
    _id: req.params.recipeid
  })
  .then(
    (recipeBD) => {
      if (recipeBD.auteur == currentUser ) {  
        Recipe.updateOne({_id: req.params.recipeid}, recipe).then(
          () => {
            res.status(201).json({
              message: 'Recipe updated successfully',
              recipe:recipe
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }else{
        res.status(401).json({
          message: 'User unauthorized to update this recipe'
        });
      }
    }
  )

};

exports.deleteRecipe = (req, res, next) => {

  const currentUser = req.auth.userId;
  // On check si notre user est l'auteur de la recette.
  Recipe.findOne({
    _id: req.params.recipeid
  })
  .then(
    (recipeBD) => {
      if (recipeBD.auteur == currentUser ) {  
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
      }else{
        res.status(401).json({
          message: 'User unauthorized to delete this recipe'
        });
      }
    }
  )

};

exports.getAllRecipes = (req, res, next) => {
  Recipe.find().limit(parseInt(req.query.qte)).then(
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