var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'sql9.freemysqlhosting.net',
	user: 'sql9233631',
	password: 'nBNPW6SRwc',
	database: 'sql9233631'
});


app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));


io.on('connection', function(client) {
	client.on('getmessages', function(){
		connection.query('SELECT * FROM messages', function(err, rows){
			for (let value of rows){
				client.emit('thread', value.content, value.author);
			}
		});
	});
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
	});

	client.on('newuser', function(username){
		client.broadcast.emit('newuserserver', username);
	});

	client.on('messages', function(data, user){
		connection.query('INSERT INTO messages (content,author) VALUES ("'+data+'", "'+user+'");');
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
	});
});

server.listen(process.env.PORT || 3000);
