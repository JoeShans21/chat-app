// initializing socket, connection to server
var socket = io.connect('https://joes-cool-chat-app.herokuapp.com/');
socket.on('connect', function(data) {

});

// listener for 'thread' event, which updates messages
socket.on('thread', function(data, user) {
  $('#thread').prepend('<li>' + data + '<br>' + user + '</li><br>');
});
socket.on('newuserserver', function(username) {
  $('#thread').prepend('<li>'+username+' has joined the server<br>Server</li><br>');
});
socket.on('sendbackuser', function(thing){
  console.log(thing);
});
socket.on('signinsendback', function(result){
  if (result==1){
    swal('Success', 'You have signed in', 'success')
    document.getElementById('username').innerHTML='signed in';
  }
  else if (result==2) {
    swal('Error', 'Username and password do not match', 'error').then((result) => {
      showModal()
    });
  }
  else if (result==3) {
    swal('Error', 'Username does not exist', 'error').then((result) => {
      showModal()
    });
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
  var content="<input type='text' placeholder='Username' id='enter_user'><br><input type='password' placeholder='Password' id='enter_pass'>";
  var el=document.createElement("div");
  el.id='stuffthing'
  $(el).append(content);
  swal({
    title: "Sign In",
    html: el,
    confirmButtonText: "Sign Up",
    showCancelButton: true,
    cancelButtonText: "Confirm",
    allowOutsideClick: false
  }).then((result) => {
    if (!result.value){
      var user=document.getElementById("enter_user").value;
      var pass=document.getElementById("enter_pass").value;
      if (user=="" || pass==""){
        swal('You left one of the fields empty').then((result) => {
          showModal();
        });
      }
      else {
        socket.emit('signin', user, pass);
        socket.emit('newuser', user);
      }
    }
    else {
      signup();
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
    confirmButtonText: "Sign In",
    cancelButtonText: "Confirm",
    showCancelButton: true
  }).then((result) => {
    if (!result.value){
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
    }
    else {
      showModal();
    }
  });
}
$( document ).ready(function() {
  showModal();
  socket.emit('getmessages');
});
