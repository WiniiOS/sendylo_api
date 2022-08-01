const express = require('express');
const recipeCtrl = require('../controllers/recipe');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

// Protection des routes via auth middleware

router.get('/get', auth, recipeCtrl.getAllRecipes);
router.post('/create', auth, multer, recipeCtrl.createRecipe);
router.get('/:recipeid', auth, recipeCtrl.getOneRecipe);
router.put('/update/:recipeid', auth, multer, recipeCtrl.modifyRecipe);
router.delete('/delete/:recipeid', auth, recipeCtrl.deleteRecipe);

module.exports = router;