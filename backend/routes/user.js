/* 25- On appelle express */
const express = require("express");

/* 26- On utilise la fonction router d'express pour créer une 
nouvelle route modulable en objet*/
const router = express.Router();

/* 27- On prépare les controllers nécessaires à user */
const userCtrl = require("../controllers/user");
//le controller va associer les fonctions aux différentes routes

/* 28- On crée les router nécessaires à user */
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
//la délcaration se fera dans app.js : userRoutes mais avant on passe à sauce.js dans routes
