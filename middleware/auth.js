const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       // extraction du token dans le header Authorization
       const token = req.headers.authorization.split(' ')[1];
       //décodage du token et verification de validité du token sur la requete entrante
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //Extraction de l'ID utilisateur de notre token
       const userId = decodedToken.userId;
       // Ajout de l'IdUSER à l’objet Request afin que nos différentes routes puissent l’exploiter.
       req.auth = {
           userId: userId
       };
	    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};