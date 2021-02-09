const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const db = require('./models/mongoose')

dotenv.config();

const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.Promise = global.Promise;

const port = 5000

require("./routes/categories.route")(app);

app.get('/', (req, res) => {
  res.send('Backend for Atelier Créatif')
})

app.post('/mail', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)

    async function mail(){
        let transporter = nodemailer.createTransport({
            host: process.env.NODE_NODEMAILER_API_SMTP,
            port: process.env.NODE_NODEMAILER_API_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.NODE_NODEMAILER_API_USERNAME,
              pass: process.env.NODE_NODEMAILER_API_PASSWORD,
            },
          });
        
          let info = await transporter.sendMail({
            from: req.body.email, // sender address
            to: "dext.1234@gmail.com", // list of receivers
            subject: req.body.firstName+' '+req.body.lastName+' vous a envoyé un mail', // Subject line
            text: req.body.content, // plain text body
            html: "<b>"+req.body.content+"</b>", // html body
          });
    }
    mail();
})


app.listen(port, () => {
  console.log(`Serveur lancé sur le port http://localhost:${port}`)
})

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if(error) res.status(400).json({"statusCode" : 400 ,"message" : error});
            req.login(user, function(error) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
    }
}

app.post('/authenticate', auth() , (req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "Bienvenue sur le système d'authentification"});
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username === process.env.NODE_ADMIN_USERNAME && password === process.env.NODE_ADMIN_PASSWORD){
            return done(null, username);
        } else {
            return done("Authorisation échouée", false);
        }
    }
));

passport.serializeUser(function(user, done) {
    if(user) done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(400).json({"statusCode" : 400, "message" : "Vous n'êtes pas connecté"})
}

app.get('/getData', isLoggedIn, (req, res) => {
    res.json("data")
})


db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connecté à la base de données!");
  })
  .catch(err => {
    console.log("Une erreur est survenue lors de la connexion à la base de données", err);
    process.exit();
  });