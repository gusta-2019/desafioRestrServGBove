const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const app = express(); 
const PUERTO = 8080;
require("./database.js");

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gusmza2005:TT003658@cluster0.s4r8tld.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))
////////////////////////////////////////////////////////
//Cambios passport: 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
///////////////////////////////////////////////////////////

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get('/', (req, res) => {
    if (req.session.login) {
        // Si ya hay una sesión iniciada, redirige al perfil o a otra ruta deseada
        res.redirect('/profile');
    } else {
        // Si no hay sesión iniciada, redirige a la pantalla de login
        res.redirect('/login');
    }
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
});


