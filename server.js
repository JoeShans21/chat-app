var express = require('express');


var app = require('express')(),
  server  = require("http").createServer(app),
  io = require("socket.io")(server);



var mysql = require('mysql');
var request = require('request');
var passwordHash = require('password-hash');
var connection = mysql.createConnection({
	host: 'sql9.freemysqlhosting.net',
	user: 'sql9251151',
	password: 'w73z9SwvYP',
	database: 'sql9251151'
});




app.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));


io.on('connection', function(client) {
	console.log('Client Conected')
	client.on('getmessages', function(){
		connection.query('SELECT * FROM messages', function(err, rows){
			for (let value of rows){
				var out = value.content
				out=out.replace('<', '&lt;')
				out=out.replace('>', '&gt;')
				client.emit('thread', value.content, value.author);
			}
		});
	});
	client.on('signup', function(first, last, email, user, pass) {
		var hashedPassword = passwordHash.generate(pass);
		connection.query('INSERT INTO chat_users (u_first,u_last,u_email,u_username,u_password) VALUES ("'+first+'", "'+last+'", "'+email+'", "'+user+'", "'+pass+'");');
		client.emit('signinsendback', 4, user)
	});

	client.on('signin', function(user, pass){
		connection.query('SELECT * FROM users WHERE u_username="'+user+'"', function(err, rows){
			try {
				var hashedPassword=rows[0].u_password;
                console.log("rows: " + rows)
				var result=passwordHash.verify(pass, hashedPassword)
				if (result){
					client.emit('signinsendback', 1, user)
				}
				else {
					client.emit('signinsendback', 2, user)
				}
			}
            catch (err){
				if (err="TypeError: Cannot read property 'u_password' of undefined"){
					client.emit('signinsendback', 3, err)
				}
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

	client.on('getusername', function(){
		client.emit('sendbackuser', socket.handshake.session.username);
	});
});

server.listen(process.env.PORT);
