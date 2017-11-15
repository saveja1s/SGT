var express = require('express')
, passport = require('passport')
, util = require('util')
, session = require('express-session')
, SteamStrategy = require(__dirname + '/node_modules/passport-steam/lib/passport-steam/index').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/auth/steam/return',
    realm: 'http://localhost:8080',
    apiKey: '7FFFDC4C8E376510F86C7DB3F894E76B'
},
function(identifier, profile, done) {
    process.nextTick(function() {
        profile.identifier = identifier;
        return done(null, profile);
    });
}));
var server = express();

server.set('view engine', 'ejs');

server.use(session({
    secret: 'my secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true}));

server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(__dirname + '/views'));

server.get('/', function(req, res) {
    res.render('index', {user: req.user});
});

server.get('/auth/steam/return',
passport.authenticate('steam', { failureRedirect: '/'}),
function(req, res) {
res.redirect('/');
});

server.set('view engine', 'ejs');

server.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', {user: req.user});
});

server.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

server.get('/auth/steam',
passport.authenticate('steam', {failureRedirect: '/'}),
function(req, res) {
res.redirect('/');
});

var port = 8080;
server.listen(port, function() {
   console.log('server listening on port ' + port);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {return next(); }
    res.redirect('/');
}