const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");

///Registro con JSON Web Token:

/*router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 
    try {
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "El email ya esta usado"});
        }

        //Creamos un nuevo usuario: 
        const nuevoUsuario = await UserModel.create({first_name, last_name, email, password:createHash(password), age});

        //Generamos un token: 
        const token = generateToken({id: nuevoUsuario._id});

        res.status(200).send({status:"success", message: "Usuario creado con éxito",  token});
        
    } catch (error) {
        console.log("Error en al autenticación", error);
        res.status(500).send({status: "error", message: "Error interno del servidor"});
    }
})


//Post para generar un usuario y almacenarlo en MongoDB
/*
router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        //Verificar si el correo ya esta registrado
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "El email ya esta registrado"});
        }

        //Si no lo encuentra, creamos el nuevo usuario: 
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name, 
            email,
            password: createHash(password), 
            age
        }); 

        //Almacenamos la info del usuario en la session:
        req.session.login = true; 
        req.session.user = {...nuevoUsuario._doc};

        res.redirect("/profile");
    } catch (error) {
        console.log("Error al crear el usuario:", error);
        res.status(500).send({error: "Error al guardar el usuario nuevo"});
    }
});
*/

///VERSION PARA PASSPORT

router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido!"});
})

module.exports = router; 