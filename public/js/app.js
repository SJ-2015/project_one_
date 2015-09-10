console.log("reading in app.js!");


$(function(){
	
	//goToSignup();
	//goToLogin();
	//signupSubmission();

	/* LIST FUNCTION */
	listLoad();

});

////////////////////////////////////////////
///										////
///	 	Routing between pages			////
///										////
////////////////////////////////////////////

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

////////////////////////////////////////////
///										////
///	 Methods for our SIGNUP page here	////
///										////
////////////////////////////////////////////

/* Handles the signup form submission */
function signupSubmission()
{
	$("#signup-form").on("submit", function(e){
		console.log("you are trying to sign up!");

		e.preventDefault();

		var formVariables = $(this).serialize();
		console.log("form variables:", formVariables);

		$.post("/users", formVariables)
		.done(function(res){
			console.log(res);
			
		});
	});
}

////////////////////////////////////////////
///										////
///	 Methods for MODIFY TASK here		////
///										////
////////////////////////////////////////////

/* User clicked on modify task */
function modifyTask(context)
{
	//console.log(arguments, "arguments")
	//console.log($(context))
	var taskId = $(context).data()._id;
	var taskDivId = "#task" + taskId;
	console.log("id: " + taskDivId);

	/* we send a get request for the form */
	$.get("/modify-task", function(res){
		//console.log(res);
		/* we append the form to the page */
		$("body").append(res);

		modifySubmit(taskId);
	});



}

function modifySubmit(id)
{
	$("#modify-task-form").on("submit", function(e){
		console.log("you would like to modify a task!");
		e.preventDefault();

		var formVariables = $("#modify-task-form").serialize();
		console.log("form variables:", formVariables);
		// console.log("form variable type:", typeof(formVariables));
		

		$.ajax({
	    	type: 'PUT',
	    	url: '/modify-task/' + id,
	    	data: formVariables,
	    	success: function(data) {
	      		getTasks();
	    	}
	  	});	
	});
}

////////////////////////////////////////////
///										////
///	 Methods for our TO DO LIST here	////
///										////
////////////////////////////////////////////


/* post request to list */
function listLoad()
{
	getTasks();

	$("#new-task-form").on("submit", function(e){
		console.log("you want to create a new task!");
		e.preventDefault();

		$.post("/list", $(this).serialize())
		.done(function(res){
			getTasks();
			$("#new-task-form")[0].reset();
		});
	});
}

function getTasks()
{
	$.get("/list-api", function(res){
		renderData(res);
	});
}

/* Render data to page */
function renderData(data)
{
	console.log(data);

	bubbleSort(data);
	template = _.template($("#task-template").html());
	var taskItems = data.map(function(task){
		var templateHtml = template(task);

		//console.log(templateHtml);
		return templateHtml;
	});

	$("#list_goes_here").html('');
	$("#list_goes_here").append(taskItems);
	

}

/* Using bubble sort algorithm to sort tasks by priority */
function bubbleSort(list)
{
	if(list.length != 0)
	{
		var currentIndex = 0;
		var lastIndex = list.length - 1;

		//debugger;

		while(currentIndex != lastIndex)
		{
			for(var i=1; i<=lastIndex; i++)
			{
				var current = i;
				var previous = current-1;

				if(list[previous].priority >list[current].priority)
				{
					var temp = list[previous];
					list[previous] = list[current];
					list[current] = temp;
				}
			}

			//debugger;
			currentIndex++;
			//console.log(list);
		}
	}

	return list;
	
}

/* deleting a task */
function deleteTask(context)
{
	console.log($(context));
	var taskId = $(context).data()._id;
	console.log("id: " + taskId);

	$.ajax({
		url: '/list/' + taskId,
		type: 'DELETE',
		success: function(res){
			//once successful, re-render all tasks
			getTasks();
		},
		error: function(res){
			getTasks();
		}
	});

}





