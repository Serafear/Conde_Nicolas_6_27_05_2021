/* 14-on importe mongoose ici également */
const mongoose = require("mongoose");

/* 15- On va crée le schema de données attendu par le front-end */
const thingSchema = mongoose.Schema({
  id: mongoose.ObjectId,
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  userId: { type: String, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: [String],
  usersDisliked: [String],
});

/* 16- On prépare ensuite le model à l'exportation dans les .js nécessaires */
module.exports = mongoose.model("Thing", thingSchema);
/* la suite est dans models user.js */
