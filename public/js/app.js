console.log("reading in app.js!");


$(function(){
	
	//goToSignup();
	//goToLogin();
	signupSubmission();
	
	listLoad();

});


/* Routes home page to signup page */
function goToSignup()
{
  	$("button#signup").click(function(e){
    	console.log("you clicked signup!");
    	e.preventDefault();

    	$.get("/signup", function(res){
      		console.log("get /signup request sent!");
      		console.log(res);
      		$('body').append(res);
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

/* post request to list */
function listLoad()
{
	$.post("/list", function(res){
		renderData(res);
	});
}


/* Render data to page */
function renderData(data)
{
	var template = _.template($("#task-template").html());
	var taskItems = data.map(function(task){
		return template(task);
	});

	$("#list_goes_here").html('');
	$("#list_goes_here").append(taskItems);



	// data.forEach(function(element){
	// 	$("#list_goes_here").append("<div class='task'><b>" + element.name + "</b><br>Description: " + element.description + "<br></div><br>");

	// });
}











