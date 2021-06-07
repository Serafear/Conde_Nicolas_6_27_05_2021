/* Avant toute chose, avant de commencer le projet, faire un npm init. Et dans 
entry point qui va s'afficher, il faut mettre server.js (à côté d'index.js)
puis créer le .gitignore et écrire node_modules

Le projet commence par app.js. C'est le premier dossier a être crée.

Les étapes seront numérotées et dispersées à l'intérieur de backend. L'étape notée 1 dans app
peut avoir sa suite dans server.js par exemple.

1- on télécharge express avec la commande npm install --save express.
Il se peut que depuis la version npm 5.0 il ne soit plus nécessaire de préciser 
--Save. Cette partie du code servait à spécifier que cette partie devait être 
incluse dans le "dependencies" du package.json
*/

/* 2- une fois express installé, on passe bien sur à sa création */
const express = require("express");



/* 12- On installe mongoose: npm install nodemon -g ? 
(si mongoose n'apparait pas dans dependencies faire ensuite npm install --save mongoose)
pour gérer la B.D. mongoDB. Ensuite ont la délcare */
const mongoose = require("mongoose");
/* Il y aura deux utilisateurs:
le premier qui est admin: password: ImaginethemosthorribleterrifyingevilthingyoucanpossiblythinkofandmultiplyitBY6!!!
            nom: megamind
le second : pssword: DisgustinglyhorrifyingS1r
            nom: minion
*/

/* 44- on importe path pour que le serveur puisse gérer les dépots d'images ensuite on 
déclare : app.use('/images', express.static(path.join(__dirname, 'images')));
 */
const path = require("path");

/* 46-On importe les routes */
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

/* 3- une fois express crée on passe bien sur à son appel à travers la création de la const app*/
const app = express();

/* 13-on importe mangoose pour pouvoir créer une connexion avec la base de donnée */
mongoose
  .connect(
    "mongodb+srv://megamind:ImaginethemosthorribleterrifyingevilthingyoucanpossiblythinkofandmultiplyitBY6!!!@cluster0.b5w2l.mongodb.net/pekockoDatabase?retryWrites=true&w=majority",

    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
/*première étape pour utiliser mongoose pour créer une interface avec la bd
mongodb c'est d créer un schéma/modèle de données pour enregistrer/lire/modifier/etc...
les objets qui sont en vente dans notre base de données. On va commencer par créer
un dossier models et un Thing.js
*/

/* 11-On crée les middlewares généraux pour les headers, les autorisations, les requetes, etc... */
app.use((req, res, next) => {
  //middleware générale applicable à toutes les routes et requêtes envoyées au serveur
  res.setHeader("Access-Control-Allow-Origin", "*"); //permet l'accès à notre API depuis n'importe quelle origine ( '*' )/tout le monde peut accéder ;
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); //autorisation d'utiliser certains headers spécifiés dans le set.header
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); //permet d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
});

/* 10- Pour gérer les requêtes HTTP POST dans Express.js version 4 et supérieure, 
vous devez installer le module middleware appelé body-parser. 
la commande est : npm install --save body-parser
On appelera ensuite la fonction avec un const
Noote importante. L'installation de body-parser a montrer 41 vulnérabilités 
Selon l'Owasp c'est un cas de : utilisation de composants contenant des vulnérabilités connues.
Il faudrait donc trouver un moyen de réduire ces vulnérabilités à 0. Body-parser est inutile ? 
Il semple qu'express vient avec body-parser depuis la version 4.16 ? car la dernière mise à jour de 
b-p date de 2019. 

ON PEUT UTILISER: app.use(express.json());
*/
app.use(express.json());



/* 45- */
app.use("/images", express.static(path.join(__dirname, "images")));

/* 47- c'est ici que l'extension api/ utilisée par le router sera mise en place
  et on dit que pour cette route la on utilise le router exposé par stuffRoutes */
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);



/* 4- on crée la fonction qui permettra d'exporter app/express dans les autres fichiers js */
module.exports = app;
