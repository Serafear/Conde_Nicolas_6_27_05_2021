/* 36- une fois les routes crées on mettra en place les controllers
 pour la sécurité. On commencera par installer bcrypt pour le hashage du password
 npm install -- save bcrypt
 */
const bcrypt = require("bcrypt");

/* 37- on importe jwt */
const jwt = require("jsonwebtoken");

/* 38- on importe user.js depuis models car on a défini le schema
 mongoose là-bas  */
const User = require("../models/User");

/* 39- On crée la logique du signup: l'inscription de nouveaux utilisateurs */
exports.signup = (req, res, next) => {
  //on utilise bcrypt
  bcrypt
    .hash(req.body.password, 10)
    //c'est la fonction pour hacher le mot de passe : ###
    //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution
    //de la fonction sera longue, et plus le hachage sera sécurisé
    .then((hash) => {
      //procède au hashage
      const user = new User({
        email: req.body.email, //demande à ce que l'email existe
        password: hash,
      });
      user
        .save()
        /*Dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, 
          et des erreurs avec le code d'erreur en cas d'échec */
        .then(() => res.status(201).json({ message: "" }))
        .catch((error) => res.status(500).json({ error }));
    })
    //si il y a un problème alors on affiche un problème
    .catch((error) => res.status(500).json({ error }));
};

// 40- ici c'est le login, la connexion des utilisateurs existants
exports.login = (req, res, next) => {
  //commençons par trouver le user auquel correspond l'email vu qu'il est unique
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "" });
      }
      //ici on va comparer le mot de passe envoyé avec la requête au hash dans la BD
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return es.status(401).json({ error: "" });
          }
          //pour une bonne connexion on renvoi le statut 200
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
              //Maintenant si on se connecte à l'app et qu'on regarde la requete dans réseau, authantification
              //On voit une chaîne de caractère aléatoire qui est désormais le token (à cause du random).
              //on encode aussi le user id pour qu'on ne puisse pas modifier les objets des autres utilisateurs.
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
}; //on retourne ensuite à sauce.js dans controller
