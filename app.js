
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var blog = require('./routes/blog');
var interface = require('./routes/interface');
var http = require('http');
var path = require('path');
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
url: "mongodb://localhost/session",
interval: 120000
});
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// for mongodb start
app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'fens.me'}));
app.use(express.session({
secret : 'fens.me',
store: store,
cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){
res.locals.user = req.session.user;
var err = req.session.error;
  delete req.session.error;
  res.locals.message= '';
  if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
next();
});
// for mongodb end

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.all('/login', notAuthentication);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
app.get('/home', authentication);
app.get('/home', routes.home);

app.get('/users', user.list);
app.get('/blog', blog.index);
app.get('/blog/:id', blog.list );
app.get('/lbs', interface.index );
app.get('/lbs/k/:keyword', interface.keyword );
app.get('/lbs/c/:coord', interface.coord );
app.get('/lbs/ip',interface.ip);
app.get('/lbs/init/lng/:lng/lat/:lat',interface.initl);
app.get('/lbs/init/word/:word',interface.initw);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function authentication(req, res, next) {
if (!req.session.user) {
req.session.error='请先登陆';
return res.redirect('/login');
}
next();
}
function notAuthentication(req, res, next) {
if (req.session.user) {
req.session.error='已登陆';
return res.redirect('/home');
}
next();
}