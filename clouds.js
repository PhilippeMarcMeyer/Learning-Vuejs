const home = "https://api.myjson.com/bins";
const key = "bvaly";
function doImport(){
	
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
	var request = new XMLHttpRequest();
	var params = {'bvaly':appTodo.treeData.childrenList};
	request.open('POST', home, true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
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


