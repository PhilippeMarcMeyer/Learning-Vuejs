
let key = "xxx"; // get your own
function doImport(){
	let home = "https://jsonblob.com/api/jsonBlob/";
	var request = new XMLHttpRequest();
	request.open('GET', home+"/"+key, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(request.responseText);
			toStorage.addall(data);
			message("You precious data is back !");
			setTimeout(function(){
				location.reload();
			},1000);
	  } else {
			message("We reached our target server, but it returned an error :-(");

	  }
	};

	request.onerror = function() {
		message("There was a connection error of some sort :-(");
	};

	request.send();	
}

function doExport(){
	let home = "https://jsonblob.com/api/jsonBlob/"
	var request = new XMLHttpRequest();
	var params = appTodo.treeData.childrenList;
	request.open('PUT', home+key, true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		  console.log(request)
			message("You precious data is saved !");
	  } else {
			message("We reached our target server, but it returned an error :-(");
	  }
	};

	request.onerror = function() {
		message("There was a connection error of some sort :-(");
	};

	request.send(JSON.stringify(params));		
}

function message(msg){
	let ptr = document.getElementById("message");
	if(ptr){
		ptr.innerHTML = msg;
	}
}


