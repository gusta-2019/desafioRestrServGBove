const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");

//Login

//Login con JSON Web Token: 

/*router.post("/login", async (req, res) => {
    const {email, password} = req.body; 
    try {
        const usuario = await UserModel.findOne({email:email});

        if(!usuario) {
            return res.status(400).send({status:"error", message: "Usuario Inexistente"});
        }

        if(!isValidPassword(password, usuario)){
            return res.status(400).send({status: "error", message: "Credenciales invalidas"});
        }

        //Si el usuario existe y la contraseña es correcta, generamos el token. 
        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            id: usuario._id
        });

        res.send({status:"success", token});
        
    } catch (error) {
        console.log("Error en la autenticación", error);
        res.status(500).send({status: "error", message: "Error interno del servidor"});
    }
})*/

///Version con Passport: 

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email
    };

    req.session.login = true;
    
    res.redirect("/products");

})

router.get("/faillogin", async (req, res) => {
    res.send({error: "Usuario o contraseña incorrectos"});
})

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

///VERSION PARA GITHUB: 

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session. 
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/profile");
})


module.exports = router;