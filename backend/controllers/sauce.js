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
    likes: 0,
    dislikes: 0,
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
  let like = req.body.like; /*on recupère le like non pas dans le req.params.like mais 
  dans le req.body.like parceque le req.body contient les données contenue dans un POST
  envoyé par le côté CLient et non server. 
  Comme nous voulons la valeur du like, nous récupérons le like au travers du POST, 
  cette donnée est inclue dans le req.body. 
  Alors que la propriété req.params est un objet contenant des propriétés 
  mappées sur les « paramètres » de la route nommée. Par exemple, si vous avez 
  la route /student/:id, alors la propriété « id » est disponible en tant que 
  req.params.id 
  */
  switch (like) {
    case like = 0: //on peut également mettre  case 0:  à la place. le case like == ou === ne fonctionne pas
      Thing.findOne({ _id: req.params.id }) /* Nous allons désigner l'ID comme étant
      celui correspondant à l'ID du chemin, et trouver cet ID au travers du findOne.
      Comme cela, on est sur de récupérer le bon objet.
      */
        .then((thing) => {
          /* (il est possible d'inclure des if dans le switch)
          Le .then retourne une promesse qui inclu le code, ou tout ce que le code
          fera une fois que l'action sera accomplie, ici appuyer sur le like par ex.
          */
          if (thing.usersLiked.find((user) => user === req.body.userId)) {
            /* la partie la plus importante de ce cas like est ici. Ce que je veux
            que le code fasse ici est de commencer par la condition. Si nous sommes 
            dans le cas où le like est nul et que le usersLiked inclu dans le schéma
            donc dans thing est strictement égal au userId qui a posté alors tu update.
            On veut ici être sur que nous récupérons le bon utilisateur et qu'il 
            ne peut enlenvé son like ou dislike qu'une fois. L'opération est unique */
            Thing.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 }, // incrémente un like
                $pull: { usersLiked: req.body.userId }, // l'opérateur supprime le like car pull. On supprime le userId du userLiked
                _id: req.params.id,
              }
            )
              .then(() => {
                res.status(201).json({ message: "Avis enregistré" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          if (thing.usersDisliked.find((user) => user === req.body.userId)) {
            /* pareil que plus haut mais pour le dislike */
            Thing.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              }
            )
              .then(() => {
                res.status(201).json({ message: "Avis enregistré" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
      break;
    // si la valeur du like est à 1
    case like = 1:
      /* l'opération ici est plus simple. Si le like = 1, alors tu update directement
      les paramètres. Tu augmente le compteur de like de 1 avec $inc, et vu que l'Id
      de l'utiliietur est récupéré et stocké dans usersLikes au travers du push,
      l'opération est unique. Il ne peut y avoir qu'un seul id pareil donc
      une seule opération par id.  */
      Thing.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res.status(201).json({ message: "Like ajouté" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;
    //likes = -1
    //explication idem que plus haut, la seule différence c'est que c'est le dislike. 
    case like = -1:
      Thing.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res.status(201).json({ message: "Dislike ajouté" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;
    default:
      console.error("Bad request");
  }
};

//on passe ensuite à app.js pour terminer toutes les déclarations
