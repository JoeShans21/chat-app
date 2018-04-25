// initializing socket, connection to server
var socket = io.connect('https://joes-chat-app.herokuapp.com/');
socket.on('connect', function(data) {

});

// listener for 'thread' event, which updates messages
socket.on('thread', function(data, user) {
  $('#thread').prepend('<li>' + data + '<br>' + user + '</li><br>');
});
socket.on('newuserserver', function(username) {
  $('#thread').prepend('<li>'+username+' has joined the server<br>Server</li><br>');
});
// prevents form from submitting and sends a message to server
function submit(){
  var user = $('#username').val();
  var message = $('#message').val();
  if (message!=="" && message.length<100){
    socket.emit('messages', message, user);
    reset();
    return false;
  }
  else {
    alert('fuck you');
  }
}
function showModal(){
  swal({
    title: "Enter a Username",
    html: "<input type='text' placeholder='Username' id='enter_user'>",
    confirmButtonText: "Confirm",
  }).then((result) => {
    var user=document.getElementById("enter_user").value
    if (user==""){
      swal('You didn\'t enter a username').then((result) => {
        showModal();
      })
    }
    else {
      document.getElementById("username").value=user;
      socket.emit('newuser', user);
    }
  })
}
function reset() {
  var message=document.getElementById('message');
  var submitbutton=document.getElementById('submitbutton');
  message.value="";
  message.disabled="true";
  submitbutton.disabled="true";
  setTimeout(function(){
    message.disabled=false;
    submitbutton.disabled=false;
  }, 10000)
}
$( document ).ready(function() {
  showModal();
  console.log('hello');
  socket.emit('getmessages');
});
