/*Ici on s'occupera de la construction de la partie serveur */
/* 5- importation du paquet node http */
const http = require("http");

/* 6- On importe app depuis app.js */
const app = require("./app");

/* 7- On utilise la fonction normalizePort offerte par express
Cette fonction s'assure que le port est soit un numéro, soit un string
Et tout le rest est faux
*/
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000"); //ici on dit d'écouter soit le port 3000 soit quel que soit la variable d’environnement PORT
app.set("port", port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* 8- On crée effectivement le serveur */
const server = http.createServer(app);

/* 9-On crée un écouteur d'évènement consignant le port ou 
  le canal nommé sur lequel le serveur s'exécute dans la console */
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;
  console.log("listening on" + bind);
});

server.listen(port);
/* pour vérifier que le serveur fonctionne on doit l'écouter soit grace
  à node server, soit en installant nodemon
  qui suivra les changements server de manière dynamique: npm install nodemon -g 
  Pour utiliser nodemon on lance: nodemon ./server.js localhost 3000
  ici 3000 c'est en fonction de la donnée du normalizePort
  */

/*le côté server est terminé, pour l'instant ? On retourne sur app.js */
