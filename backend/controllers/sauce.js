/* 41-on importe thing depuis models */
const Thing = require("../models/Thing");


/* 42-pour avoir accès au système de fichier pour delete les données 
dans la base de donnée */
const fs = require("fs"); //file system

/* 43- On fabrique les routes déclarées dans routes*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); /*
  pourquoi req.body.sauce marche et non req.body.thing ?
  
  */
  delete sauceObject._id;
  const thing = new Thing({
    ...sauceObject,
    likes :0,
    dislikes:0,
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
      const sauceObject = req.file //on regarde si un req.file existe, c-a-d si une image est présente dans la modification
        ? {
            ...fs.unlink(`images/${filename}`, () => {
              // les ... sont l'opérateur spread qui fait une copie des éléments associés.
              //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier
            }),
            //si oui il existe on remplace l'image

            ...JSON.parse(req.body.sauce), //le spread va copier le body.sauce de la request
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              //on utilise multer
              req.file.filename
            }`,
          }
        : {
            //si non il n'existe pas, on change juste les textes
            ...req.body, //le spread va copier le body de la request
          };
      Thing.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id } //nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    });
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
/*
Ce code crée une nouvelle sauce, ce n'est pas ce que je veux. l'objet pollue juste la 
base de donnée, car la nouvelle sauce n'a aucune information de toute façon

exports.sauceLike = (req, res, next) => {
    const likeObject = JSON.parse(req.body.like);
    delete likeObject._id;
    const thing = new Thing({
      ...likeObject,
    })
    thing
    .save()
    .then(() => res.status(201).json({ message: "Objet liké !" }))
    .catch((error) => res.status(400).json({ error }));
};*/

//essai sauce, n°2
exports.sauceVote = (req, res, next) => {
  let like = req.params.like;
  switch (like) {
    case like === 1:
      Thing.findOne({ _id: req.params.id }).then(() => {
        Thing.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 } },
          { $push: { userId: 1 } }
        )
          .then(() => res.status(200).json({ message: "Objet liké !" }))
          .catch((error) => res.status(400).json({ error }));
      });
      break;

    case like === 0:
      Thing.findOne({ _id: req.params.id }).then(() => {
        Thing.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 } },
          { $push: { userId: -1 } }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      });
      break;

    case like === -1:
      Thing.findOne({ _id: req.params.id }).then(() => {
        Thing.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 } },
          { $push: { userId: 1 } }
        )
          .then(() => res.status(200).json({ message: "Objet disliké !" }))
          .catch((error) => res.status(400).json({ error }));
      });
  }
};

//on passe ensuite à app.js pour terminer toutes les déclarations
