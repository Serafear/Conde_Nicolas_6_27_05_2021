/* 14-on importe mongoose ici également */
const mongoose = require("mongoose");

/* 15- On va crée le schema de données attendu par le front-end */
const thingSchema = mongoose.Schema({
  name: { type: String, require: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  mainPepper: { type: String, require: true },
  imageUrl: { type: String, require: true },
  heat: { type: Number, require: true },
  userId: { type: String, require: true },
  likes: { type: Number}, //pour avoir les valeurs 0 par défaut on aurait pu faire { type: Number, default: 0 } au lieu de les déclarer dans le controllers
  dislikes: { type: Number},
  usersLiked: {type:[String]},
  usersDisliked: {type:[String]} //pas de virgule
});

/* 16- On prépare ensuite le model à l'exportation dans les .js nécessaires */
module.exports = mongoose.model('Thing', thingSchema);
/* la suite est dans models user.js */
