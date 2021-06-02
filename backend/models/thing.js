/* 14-on importe mongoose ici également */
const mongoose = require("mongoose");

/* 15- On va crée le schema de données attendu par le front-end */
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: String, required: true },
  usersDisliked: { type: String, required: true },
});

/* 16- On prépare ensuite le model à l'exportation dans les .js nécessaires */
module.exports = mongoose.model("Sauce", sauceSchema);
/* la suite est dans models user.js */
