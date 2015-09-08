console.log("reading in app.js!");


$(function(){
	
	//goToSignup();
	goToLogin();
	signupSubmission();
	

});


/* Routes home page to signup page */
function goToSignup()
{
	$("button#signup").click(function(e){
		console.log("you clicked signup!");
		e.preventDefault();

		$.get("/signup", function(res){
			console.log("get /signup request sent!");
		});
	});
}

/* Routes home page to the login page */
function goToLogin()
{
	$("button#login").click(function(e){
		console.log("you clicked login!");
		e.preventDefault();

		$.get("/login", function(res){
			console.log("get /login request sent!");
		});
	});
}

/* Handles the signup form submission */
function signupSubmission()
{
	$("button#sign_up").click(function(e){
		console.log("entry submitted!");

		e.preventDefault();

		$.post(["/users", "/signup"], $(this).serialize())
		.done(function(res){
			console.log(res);
		});
	});
}

