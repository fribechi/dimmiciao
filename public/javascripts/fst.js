
var oldStockValue = 0;
var messages = [];
var user;


function login2() {
	
	var message = {user: user};
	$('#userName').text("Hello, " + user + " !");
	$('#userStock').text("");
	
	//socket.emit('login', message);
	
	//alert('login event sent');
	console.log('login event sent');
}

function login() {
	
	user = $("#login-user").val();
	
	var message = {user: $("#login-user").val()};
	$('#userName').text("CIAO, " + $("#login-user").val() + " !");
	$('#logout').text('Log out');
	
	//socket.emit('login', message);
	
	//alert('login event sent');
	console.log('login event sent');
}

function loginControl() {
	
	var flag = $('#login-user').val();
	
	if (flag) {
		
		login();
	} 
	else {
		
		$('#loginErr').text('You must enter a name!')
	}
}



$(document).ready(function(){
    
	$("#content").html("<form id='start-form'>"+
    		           "User:&nbsp;<input id='login-user' type='text'/>" +
					   "<p id='loginErr' style='color:red;'></p>" +
    		           "<input id='login-user-button' type='button' onclick='loginControl()' value='Login'/>" + 
    		           "</form>");
					   
	
});
