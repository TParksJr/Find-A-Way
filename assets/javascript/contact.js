
  var database = firebase.database();
 
$("#contactUsBtn").on('click',function(event){
     event.preventDefault();
var name = $("#name").val().trim();
var email = $("#email").val().trim();
var subject = $("#subject").val().trim();
var message = $("#message").val().trim();
    console.log(name);
     console.log(email);
     console.log(subject);
     console.log(message);
    console.log("Submit");
   database.ref().push({
    name : name,
    email : email,
    subject : subject,
    message : message,
    timeAdded : firebase.database.ServerValue.TIMESTAMP
})
window.location.replace("thanks.html");
})