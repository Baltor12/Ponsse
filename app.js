// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var client = new restClient();

//var configDB = require('./config/database.js');
//app.use('/js', express.static(__dirname + '/client/js'));
//app.use('/styles', express.static(__dirname + '/public/stylesheets'));


//:::::::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::::::::::

// Variables ===================================================================



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// configuration ===============================================================

/*var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'admin'
};

mongoose.connect(configDB.url, options);
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session*/

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

//:::::::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::::::::::

// REST Methods=================================================================

/**
* Get the list of data and its types via REST service from MES
* Sort them with respect to data type
* Hint: Every sorting is done here inorder to let the client be light weight and faster
*/
/*function initialConfig(){
	client.get("https://ih-wizdom-api:WgWq22Rq72UsW@api.trelab.fi/2/smartTag/991", function (data, response) {
		console.log(data);
	});
}

//Calling the function to get the data point and associate them
initialConfig();
*/
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//-----------------------------------------------------------------------------//

const https = require('https');

https.get('https://ih-wizdom-api:WgWq22Rq72UsW@api.trelab.fi/2/smartTag/991', (res) => {

  res.on('data', (d) => {
    process.stdout.write(d);
	console.log(d);
  });

}).on('error', (e) => {
  console.error(e);
});


//////////////////////////////////////////////////////////////////////////////////get the item being added.
app.post('/getNewObject', function(req, res) {
	var curr_id = uuid.v1();
	res.json(curr_id);	
});

//////////////////////////////////////////////////////////////////////////////////get the item being added.

//////////////////////////////////////////////////////////////////////////////////move the item being added.

//Using Sockets the Copy the above code.

server.listen(port);

console.log('The magic happens on port ' + port);

///////////////////////////////////////////////////////////////////////////////////////////



