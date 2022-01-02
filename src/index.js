const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const cookieparser = require('cookie-parser');
const route = require('./routes');
const app = express();
const http = require('http');

const server = http.createServer(app);
const { io } = require('./middlewares/socketO');

const db = require('./config/db');
const session = require('express-session');
const methodOverride = require('method-override');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const socialNetwork = require('./config/social/index');
const port = process.env.PORT || 800;

// connect db
db.connect();

//passport 
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: socialNetwork.facebook_key,
    clientSecret:socialNetwork.facebook_secret ,
    callbackURL: socialNetwork.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {        
        return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: socialNetwork.google_key,
    clientSecret:socialNetwork.google_secret,
    callbackURL: socialNetwork.gg_callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {        
        return done(null, profile);
    });
  }
));

//aap.use
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        helpers: {
            toLocaleString: (a) => Number(a).toLocaleString('da-DK'),
        },
    }),
);
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
//cokie and session
app.use(cookieparser(process.env.SESSION_SECRET));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
    }),
);

//app.set
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//more
io.attach(server);
route(app);

server.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`),
);

module.exports = app;
