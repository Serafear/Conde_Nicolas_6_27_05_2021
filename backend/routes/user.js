/* 25- On appelle express */
const express = require("express");
const rateLimit = require('express-rate-limit');

/* 26- On utilise la fonction router d'express pour créer une 
nouvelle route modulable en objet*/
const router = express.Router();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,    // 10 minutes et 15 * 60 * 1000 = 15 minutes et 60 * 60 * 1000 = 1 heure
    max: 8,                       // 8 requetes par IP
    message:"Trop de tentatives, essayez dans 10 minutes "  //message affiché au delà de 8 requetes                   
});

/* 27- On prépare les controllers nécessaires à user */
const userCtrl = require("../controllers/user");
//le controller va associer les fonctions aux différentes routes

/* 28- On crée les router nécessaires à user */
router.post("/signup", userCtrl.signup);
router.post("/login", limiter, userCtrl.login);




module.exports = router;
//la délcaration se fera dans app.js : userRoutes mais avant on passe à sauce.js dans routes
