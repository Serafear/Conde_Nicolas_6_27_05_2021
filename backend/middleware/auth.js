/* 25-Nous allons à présent créer le middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est 
authentifié avant d'autoriser l'envoi de ses requêtes.
Installons d'abord jsonwebtoken : npm install --save jsonwebtoken */
const jwt = require("jsonwebtoken");

/* 26- on crée le module utilisant jwt qui sera exporté ensuite dans les 
.js de route ou autres */
module.exports = (req, res, next) => {
  try {
    //étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch ;
    const token = req.headers.authorization.split(" ")[1]; //le [1] dit de recupérer le second élément du tableau authorization, le premier étant bearer ?
    /*nous extrayons le token du header Authorization de la 
      requête entrante. N'oubliez pas qu'il contiendra également 
      le mot-clé Bearer . Nous utilisons donc la fonction split 
      pour récupérer tout après l'espace dans le header. 
      Les erreurs générées ici s'afficheront dans le bloc catch ; */
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //il faut que cette clé corresponde à celle du login
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      /*si la demande contient un ID utilisateur, nous le
           comparons à celui extrait du token. 
          S'ils sont différents, nous générons une erreur ; */
      throw "";
    } else {
      /*dans le cas contraire, tout fonctionne et notre utilisateur est
           authentifié. 
          Nous passons l'exécution à l'aide de la fonction next() . */
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error(""),
    });
  }
};
//on passe ensuite à la création des routes.
