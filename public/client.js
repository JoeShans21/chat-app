         // initializing socket, connection to server
         var socket = io.connect('https://joes-chat-app.herokuapp.com/');
         socket.on('connect', function(data) {
            socket.emit('join', 'Hello server from client');
         });

         // listener for 'thread' event, which updates messages
         socket.on('thread', function(data, user) {
            $('#thread').prepend('<li>' + data + '<br>' + user + '</li>');
         });

         // prevents form from submitting and sends a message to server
         $('form').submit(function(){
            var user = $('#username').val();
            var message = $('#message').val();
            socket.emit('messages', message, user);
            $('input[type=text].message').val('');
            return false;
         });
         function reset() {
            document.getElementById('message').value="";
         }
