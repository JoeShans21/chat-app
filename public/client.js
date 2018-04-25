// initializing socket, connection to server
var socket = io.connect('localhost:5000');
socket.on('connect', function(data) {

});

// listener for 'thread' event, which updates messages
socket.on('thread', function(data, user) {
  $('#thread').prepend('<li>' + data + '<br>' + user + '</li><br>');
});
socket.on('newuserserver', function(username) {
  $('#thread').prepend('<li>'+username+' has joined the server<br>Server</li><br>');
});
socket.on('wassup', function(thing){
  $('#thread').prepend('<li>'+thing+'<br>Server</li><br>');
});
socket.on('signupsendback', function(result){
  if (result){
    swal('Success', 'You have signed in', 'success')
    document.getElementById('username').value=document.getElementById('enter_user').value
  }
  else {
    swal('Success', 'Username and password do not match', 'error')
  }
})
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
  var content="<input type='text' placeholder='Username' id='enter_user'><br><input type='password' placeholder='Password' id='enter_pass'><br><input type='button' onclick='signup()' value='Sign Up'>";
  var el=document.createElement("div");
  el.id='stuffthing'
  $(el).append(content);
  swal({
    title: "Sign In",
    html: el,
    confirmButtonText: "Confirm",
  }).then((result) => {
    var user=document.getElementById("enter_user").value;
    var pass=document.getElementById("enter_pass").value;
    if (user=="" || pass==""){
      swal('You left one of the fields empty').then((result) => {
        showModal();
      });
    }
    else {
      socket.emit('signin', user, pass);
      document.getElementById("username").value=user;
    }
  });
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
function signup(){
  swal({
    title: "Sign Up",
    html: "<input type='text' placeholder='First Name' id='new_first'><br><input type='text' placeholder='Last Name' id='new_last'><br><input type='text' placeholder='Email' id='new_email'><br><input type='text' placeholder='Username' id='new_user'><br><input type='password' placeholder='Password' id='new_pass'>",
    confirmButtonText: "Confirm",
  }).then((result) => {
    var new_first=document.getElementById('new_first').value
    var new_last=document.getElementById('new_last').value
    var new_email=document.getElementById('new_email').value
    var new_user=document.getElementById('new_user').value
    var new_pass=document.getElementById('new_pass').value
    if (new_first==""){
      swal('You left one of the fields empty').then((result) => {
        signup();
      });
    }
    socket.emit('signup', new_first, new_last, new_email, new_user, new_pass)
  });
}
$( document ).ready(function() {
  showModal();
  socket.emit('getmessages');
});
