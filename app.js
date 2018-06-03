var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var https = require('https');
var url = require('url');

// Get App VCAP properties
// Constants
const PORT = 3000; //8080;
const HOST = '0.0.0.0';
console.log ("starting " + __dirname)
console.log ("port "+PORT+ " host "+HOST)

//app.get('/', (req, res) => {
//    res.send('Hello world\n');
//});
app.listen(PORT, HOST);



