const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

mongoose.connect(mongo_url)
    .then(()=> console.log("Conectados a la BD"))
    .catch((error)=> console.log("No se puede conectar a la BD", error))
