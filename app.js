const express = require('express');
var app = express();

var treeGenerator = require('./controllers/dataGenerator');

app.use(express.static('./basic-static'));

app.set('view engine','ejs');

app.listen(5000,function(){
  
    console.log("Server Up and running on port: "+this.address().port);
});


treeGenerator(app);
