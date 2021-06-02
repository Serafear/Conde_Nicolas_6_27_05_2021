/* 29- La première chose que nous allons faire est de dissocier notre logique de 
routing et la logique globale de l'application. Ici on
s'occupera de la logique de nos routes sauce
Commençons par déclarer les éléments indispensables*/
const express = require("express");
const router = express.Router();

/* 30-On importe le middleware auth crée tantôt */
const auth = require("../middleware/auth");

/* 31-On importe multer pour que l'utilisateur puisse ajouter des données */
const multer = require("../middleware/multer-config");

/* 32-On pr-importe le controlle de sauce car il n'est pas encore crée 
(le 33 est la création du dossier et des fichiers) */
const sauceCtrl = require("../controllers/sauce");

/* 34- On crée les routes de sauce. on utilise router comme ça, chaque route est 
une sorte de mini appli qui n'impacte pas les autres. Le chemin est ainsi 
isolé et plus facile à mettre en place */
router.get("/", auth, sauceCtrl.getAllStuff);
//le auth est la const auth déclarée ici. GetAllStuff par exemple est le chemin qui sera
//utilisé dans app.js, mais il n'est pas encore crée. Pareil pour les autres
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, multer, sauceCtrl.likeSauce);
//avec auth les routes sont sécurisées et avec multer l'utilisateur peut modifier les données

/* 35-On prépare le module à l'exportation */
module.exports = router;
/* le 36 sera dans controller user */
