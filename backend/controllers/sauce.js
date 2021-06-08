/* 41-on importe thing depuis models */
const Thing = require("../models/Thing");

/* 42-pour avoir accès au système de fichier pour delete les données 
dans la base de donnée */
const fs = require("fs"); //file system

/* 43- On fabrique les routes déclarées dans routes*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); /*
  pourquoi req.body.sauce marche et non req.body.thing ?
  
  (ne pas oublier créer une limitation du poids d'envoi)*/
  delete sauceObject._id;
  const thing = new Thing({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id, //nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) //nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1]; //nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      fs.unlink(`images/${filename}`, () => {
        //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier
      });
    })
    .then(() => {
      const sauceObject = req.file //on regarde si un req.file existe, c-a-d si une image est présente dans la modification
        ? {
            //si oui il existe on remplace l'image
            //par contre comment faire pour supprimer l'ancienne image pour qu'elle ne soit pas stockée dans images ?
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              //on utilise multer
              req.file.filename
            }`,
          }
        : {
            //si non il n'existe pas, on change juste les textes
            ...req.body,
          };
      Thing.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id } //nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  /* Dans cette partie du code on dit à la machine de recupérer l'Id correspondate à l'objet
    puis pour la commande modifier, d'unlink la photo précédente. Le unlink permet de supprimer
    un fichier dans node.js du local file system. Pour le supprimer de la base de donnée mongo
    on utilise deleteOne. Ici on veut simplement remplacer l'image. 
    Donc on recupère l'élément en fonction de son id, on le vire du système local, puis on
    pose la question: est ce qu'il y a un req.file, c-a-d, s'il y a une image. Si oui, on introduit la nouvelle photo
    avec multer puis on fait la mise en jour dans la base de donnée avec updateOne.
    Si non, on update simplement sans photo aka sns multer. 
    */
};

exports.deleteSauce = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }) //nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1]; //nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      fs.unlink(`images/${filename}`, () => {
        //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* le problème de la sauce c'est que le like doit persister même après qu'on back */
exports.sauceLike = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//on passe ensuite à app.js pour terminer toutes les déclarations
