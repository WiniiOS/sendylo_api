const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({
             message: 'User created successfully',
             user: user
          }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // 401 unauthorized
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        message:'Logged In successfully',
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })
                }
                
            ).catch(error => res.status(500).json({ error }));

        }).catch(error => res.status(500).json({ error }));
};