
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


var MySQLSessionStore = require('connect-mysql-session')(express);
var autorouter = require('express-autoroute');
var dbConfig = require("./db.json");

var app = express();
autorouter(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(dbConfig["secretName"]));

app.use(express.session({
//    store: new MySQLSessionStore(dbConfig["dbName"], dbConfig["uName"], dbConfig["uPwd"], {
//        forceSync : false,
//        checkExpirationInterval : 1000*60*10,
//        defaultExpiration : 1000*60*60*0.5
//    }),
//    secret: dbConfig["secretName"]
}));
app.use(app.router);

app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
