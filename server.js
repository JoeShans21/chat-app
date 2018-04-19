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
	var id="1"
	connection.query('SELECT * FROM messages WHERE id="'+id+'"', function(rows){
		console.log("rows");
	});
	connection.end();
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
	});

	client.on('messages', function(data, user){
		connection.query('INSERT INTO messages (content,author) VALUES ("'+data+'", "'+user+'");');
		connection.end();
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
	});
});

server.listen(process.env.PORT || 3000);
