/* 22-multer nous permettra d'accepter des fichiers entrants. Il permettra par
exemple aux utilisateurs de télécharger les photos de leurs prodduits/sauces.
D'abord installons multer: npm install --save multer
Les images seront enregistrées dans un sous-dossier appelé images . 
Créez donc ce sous-dossier dans votre dossier backend . 
Ensuite on importe multer*/
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* 23- on crée un objet de configuration pour multer
on utilise une fonction demulter =discktorage pour dire qu'on va l'enrgistrer sur le disque
*/
const storage = multer.diskStorage({
  //l'objet a besoin de deux éléments: destination qui va expliquer à multer dans quel dossier enregistrer
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //le deuxième élément filename explique à multer quel nom de fichier utilisé. On va crée un nom custom
  filename: (req, file, callback) => {
    //on va utiliser le nom d'origine du fichier. On va éliminer des espaces si présents en les remplaçants par des underscore avec split et on rejoint le tout avec join
    const name = file.orginalname.split("").join("");
    //on va utiliser les mime type pour custom le nom
    const extension = MIME_TYPES[file.mimetype];
    //date now recupere date+heure à la miliseconde ce qui rend les dates quasi impossible à être identiques.
    callback(null, name + Date.now() + "." + extension);
  },
});

/* 24-on prépare multer à l'exportation */
module.exports = multer({ storage }).single("image");
//On passe ensuite à auth.js qu'on utilisera dans le dossier routes.
