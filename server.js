var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));


io.on('connection', function(client) {
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
	});

	client.on('messages', function(data, user){
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
	});
});

server.listen(process.env.PORT || 3000);
