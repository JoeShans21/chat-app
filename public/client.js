         // initializing socket, connection to server
         var socket = io.connect('https://joes-chat-app.herokuapp.com/');
         socket.on('connect', function(data) {
            
         });

         // listener for 'thread' event, which updates messages
         socket.on('thread', function(data, user) {
            $('#thread').prepend('<li>' + data + '<br>' + user + '</li><br>');
         });
         socket.on('newuser', function() {
            $('#thread').prepend('<li>Someone has joined the server<br>Server</li><br>');
         });

         // prevents form from submitting and sends a message to server
         $('#send').submit(function(){
            var user = $('#username').val();
            var message = $('#message').val();
            socket.emit('messages', message, user);
            reset();
            return false;
         });
         function showModal(){
            swal("Hello")
         }
         function reset() {
            document.getElementById('message').value="";
         }
