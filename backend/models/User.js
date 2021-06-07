/* 17- on importe mongoose également */
const mongoose = require("mongoose");

/* 18- Pour limiter le duplicata d'utilisateurs, c-a-d, pour n'avoir qu'un utilisateur
dans la base de données avec les identifiants requis on installera uniqueValidator
npm install --save mongoose-unique-validator 
on va rajouter ce validator comme plugin au schema et ce validator sera appliqué au schema avant d'en faire un model*/
const uniqueValidator = require("mongoose-unique-validator");

/* 19- On crée le schéma utilisateur attendu par le front-end */
const userSchema = mongoose.Schema({
  userId: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  //ici le unique:true prend compte du unique validator
  password: { type: String, require: true }
});

/* 20- on déclare le plugin de unique validator qui sera appliqué au schema avant d'en faire un model*/
userSchema.plugin(uniqueValidator);

/* 21- on prépare le model user à l'exportation dans les .js nécessaires */
module.exports = mongoose.model('User', userSchema);

//on va maintenant créer un dossier middleware qu'on va remplir pour utiliser un peu plus tard. le premier à remplir sera multer-config
