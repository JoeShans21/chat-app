var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'joeshans21.mysql.pythonanywhere-services.com',
  user     : 'joeshans21',
  password : 'ipodgenius',
  database : 'joeshans21$nodechat'
});


app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));


io.on('connection', function(client) {
	console.log('Client connected...');
  connection.connect();
  connection.query('SELECT content, author WHERE id=1', function (content, author) {
    client.emit("thread", content, author);
    client.broadcast.emit("thread", content, author);
  });
  connection.end();
	client.on('join', function(data) {
		console.log(data);
	});

	client.on('messages', function(data, user){
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
	});
});

server.listen(process.env.PORT || 3000);
