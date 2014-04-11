// Express initialization
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express(); 
app.use(bodyParser());
app.use(logger());
app.set('title', 'nodeapp');

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';

var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>PAGE LOAD HOORAY</p>');
});

app.get('/scores.json', function(request, response) {
  var username = request.query.username; // dealing with a query variable
  // Example: on your web browser, go to http://[domain here, e.g., localhost]:3000/scores.json?username=joker
  console.log("I see a username: " + username)
  response.set('Content-Type', 'text/json');
  response.send('{"username": ' + username + '}');
});

app.post('/submit.json', function(request, response) {
  // Send data to this web application via:
  //   curl --data "playdata=blah..." http://[domain here, e.g., localhost]:3000/submit.json
  userinput = request.query.username;
  console.log("Someone sent me some data: " + userinput);

  // Let's insert whatever was sent to this web application (read: NSFW) to a collection named 'abyss' on MongoDB

  // 1. Specify a collection to use
  db.collection('abyss', function(error, collection) {

    // 2. Put data into the collectiontheDocument = {"dump":userinput};
    collection.insert(theDocument, function(error, saved) {

      // What you really want to do here: if there was an error inserting the data into the collection in MongoDB, send an error. Otherwise, send OK (e.g., 200 status code)
      response.send(200);
    });
  });
});

app.listen(process.env.PORT || 3000);
