//Express
var express = require("express");
var app = express();

//Static directories
app.use(express.static("public"));
app.use(express.static("public/res"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));

//Routing
app.get("/", function(request, response){
  res.sendFile("index.html");
});

//Listen
var server = app.listen(3000, function(){

  //Debug
  console.log("Server listening on port 3000");
});
