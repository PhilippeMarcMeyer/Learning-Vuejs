
let key = "xxxx";
function doImport(){
	let home = "https://jsonblob.com/api/jsonBlob/";
	var request = new XMLHttpRequest();
	request.open('GET', home+"/"+key, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		let remoteData = JSON.parse(request.responseText);
		let remoteFlat = treeFlatten(remoteData);
		let localFlat = treeFlatten(appTodo.treeData.childrenList);
		let localSaved = [];
		localFlat.forEach(function(loc){
			let found = false;
			remoteFlat.forEach(function(rem){
				if(loc.id == rem.id){
					found = true;
				}
			});
			if(!found){
				localSaved.push(loc);
			}
		});
		if(localSaved.length >0){
			mergeSavedTasks(localSaved,remoteData);
			
			
			/*
			let savedTasks = {};
			  savedTasks.id = Date.now();
			  savedTasks.parentId = 0;
			  savedTasks.toDoTitle = "Saved tasks";
			  savedTasks.toDoSummary = "List of saved tasks : ";
			  savedTasks.done = false;
			  savedTasks.order = savedTasks.id;
			  savedTasks.childrenList = [],
			  savedTasks.editModeTitle=false,
			  savedTasks.editModeSummary=false,
			  
			localSaved.forEach(function(x){
				x.parentId = savedTasks.id;
				savedTasks.childrenList.push(x);
			});
		   remoteData.push(savedTasks);
		   */
		}
		
		let letsGo = true;
		if(letsGo){
			toStorage.addall(remoteData);
			let list = toStorage.getList();
			checkData(list);
			treeData = prepareData(list);
	
			appTodo.treeDatas = treeData;
						
			message("You precious data is back !");
		}
					
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


