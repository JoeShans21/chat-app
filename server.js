var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var request = require('request');
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
	client.on('signup', function(first, last, email, user, pass) {
		connection.query('INSERT INTO users (u_first,u_last,u_email,u_username,u_password) VALUES ("'+first+'", "'+last+'", "'+email+'", "'+user+'", "'+pass+'");');
	});

	client.on('signin', function(user, pass){
		connection.query('SELECT * FROM users WHERE u_username="'+user+'"', function(err, rows){
			var password=rows[0].u_password;
			if (pass==password){
				client.emit('signupsendback', true)
			}
			else {
				client.emit('signupsendback', false)
			}
		});
	});

	client.on('newuser', function(username){
		client.broadcast.emit('newuserserver', username);
	});

	client.on('messages', function(data, user){
		connection.query('INSERT INTO messages (content,author) VALUES ("'+data+'", "'+user+'");');
		client.emit('thread', data, user);
		client.broadcast.emit('thread', data, user);
		console.log('someone recieved messages');
	});
});

server.listen(5000, '127.0.0.1');
