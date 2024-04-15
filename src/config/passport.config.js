//Instalamos: npm i passport passport-local

//Importamos los módulos: 

const passport = require("passport");
const local = require("passport-local");

//Estrategia Passport con GitHub:
const GitHubStrategy = require("passport-github2");

//Me traigo el UserModel y las funciones de bcrypt. 
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");


const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        //Le decis que queres acceder al objeto request
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            //Verificamos si ya existe un registro con ese mail
            let user = await UserModel.findOne({email:email});
            if(user) return done(null, false);
            //Si no existe, voy a crear un registro nuevo: 
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia, ahora para el "login":
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese email:
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("Usuario inexistente");
                return done(null, false);
            }
            //Si existe, verifico la contraseña: 
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

//Agregamos otra estrategia, ahora para el "login":
passport.use("login", new LocalStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    try {
        //Primero verifico si existe un usuario con ese mail.
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log("Este usuario no existe");
            return done(null, false);
        }
        //Si existe verifico la contraseña: 
        if (!isValidPassword(password, user)) return done(null, false);
        return done(null, user);

    } catch (error) {
        return done(error);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
})

//Acá desarrollamos nuestra nueva estrategia con GitHub: 
passport.use("github", new GitHubStrategy({
        clientID: "Iv1.c69a50481a86f1db",
        clientSecret: "9ec932c19ef40c7a385ce73e92f04e2e6e0e0f8a",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Opcional: si quiero ver como llega el perfil del usuario 
        console.log(profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email })

            if (!user) {
                //Sino encuentro ningun usuario con este email, lo creo
                let newUser = {
                    first_name: profile._json.name,
                    last_name: " ",
                    age: 36,
                    email: profile._json.email,
                    password: " "
                }
                //una vez que tengo el usuario lo guardo en MongoDB
                let result = await UserModel.create(newUser);
                done(null, result)
            } else {
                done(null, user);
            }

        } catch (error) {
            return done(error);
        }

    }))

}

module.exports = initializePassport;