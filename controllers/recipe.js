const Recipe = require('../models/Recipe');
const fs = require('fs');

// externalisation de toutes nos routes dans le controlleur
exports.createRecipe = (req, res, next) => {

  if (req.body.nom !== "") {

    const recipeObject = JSON.parse(req.body.recipe);
    delete recipeObject._id;
    delete recipeObject.auteur;

    const recipe = new Recipe({
        ...recipeObject,
        auteur: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    recipe.save()
    .then(() => { res.status(201).json({message: 'Recipe saved successfully!', recipe: recipe})})
    .catch(error => { res.status(400).json( { error })})

  }else{
    res.status(401).json({
      message: "The path 'nom' can't be empty"
    });
  }

};

// exports.createRecipe = (req, res, next) => {

//   const userId = req.auth.userId;

//   if (req.body.nom !== "") {
    
//     const recipe = new Recipe({
//       nom: req.body.nom,
//       ingredients: req.body.ingredients,
//       temps_cuisson: req.body.temps_cuisson,
//       difficulte: req.body.difficulte,
//       auteur: userId
//     });
//     recipe.save().then(
//       () => {
//         res.status(201).json({
//           message: 'Recipe saved successfully!',
//           recette: recipe
//         });
//       }
//     ).catch(
//       (error) => {
//         res.status(400).json({
//           error: error
//         });
//       }
//     );

//   }else{
//     res.status(401).json({
//       message: "The path 'nom' can't be empty"
//     });
//   }
  
// };

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

// exports.modifyRecipe = (req, res, next) => {
//   const recipe = new Recipe({
//     _id: req.params.recipeid,
//     nom: req.body.nom,
//     ingredients: req.body.ingredients,
//     temps_cuisson: req.body.temps_cuisson,
//     difficulte: req.body.difficulte
//   });

//   const currentUser = req.auth.userId;
//   // On check si notre user est l'auteur de la recette.
//   Recipe.findOne({ _id: req.params.recipeid })
//   .then((recipeBD) => {
//       if (recipeBD.auteur == currentUser ) {  
//         Recipe.updateOne({_id: req.params.recipeid}, recipe).then(
//           () => {
//             res.status(201).json({
//               message: 'Recipe updated successfully',
//               recipe:recipe
//             });
//           }
//         ).catch((error) => { res.status(400).json({ error: error }) });
//       }else{
//         res.status(401).json({ message: 'User unauthorized to update this recipe' });
//       }
//     }
//   )

// };

exports.modifyRecipe = (req, res, next) => {

  // On gere le cas ou il n'y aura pas de fichier
  const recipeObject = req.file ? {
      ...JSON.parse(req.body.recipe),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  const currentUser = req.auth.userId;
  delete recipeObject.auteur;

  Recipe.findOne({_id: req.params.recipeid})
      .then((recipeBD) => {
          if (recipeBD.auteur != currentUser) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
            Recipe.updateOne({ _id: req.params.recipeid}, { ...recipeObject, _id: req.params.recipeid})
              .then(() => res.status(200).json({message : 'Recipe updated successfully',recipe:recipeObject}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// exports.deleteRecipe = (req, res, next) => {

//   const currentUser = req.auth.userId;
//   // On check si notre user est l'auteur de la recette.
//   Recipe.findOne({_id: req.params.recipeid })
//   .then(
//     (recipeBD) => {
//       if (recipeBD.auteur == currentUser ) {  
//         Recipe.deleteOne({_id: req.params.recipeid}).then(
//           () => {
//             res.status(200).json({
//               message: 'Deleted!'
//             });
//           }
//         ).catch(
//           (error) => {
//             res.status(400).json({
//               error: error
//             });
//           }
//         );
//       }else{
//         res.status(401).json({
//           message: 'User unauthorized to delete this recipe'
//         });
//       }
//     }
//   )

// };

exports.deleteRecipe = (req, res, next) => {
  Recipe.findOne({ _id: req.params.recipeid})
    .then(recipeBD => {
      if (recipeBD.auteur != req.auth.userId) {
        res.status(401).json({message: 'Not authorized'});
      } else {
        const filename = recipeBD.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Recipe.deleteOne({_id: req.params.recipeid })
            .then(() => { res.status(200).json({message: 'Recette supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch( error => {
      res.status(500).json({ error });
    });
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