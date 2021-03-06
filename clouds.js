
let cloudkey = "";

function getNewKey(callBack){
	showLoader();  
	let home = "https://jsonblob.com/api/jsonBlob/"
	var request = new XMLHttpRequest();
	var params = appTodo.treeData.childrenList;
	request.open('POST', home, true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	message("");
	message("","key-message");
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		   let arr = request.getResponseHeader("location").split("/");;
		   if(arr.length >0){
			   cloudkey = arr[arr.length-1];
			   localStorage["cloudkey"] = cloudkey;
		   }
			message("Your key is " + cloudkey+" it is saved on this device but copy it if you want to use it on another device","key-message");
			hideLoader(); 
			callBack();
	  } else {
			message("Could not get you a key => unexpected error :-(");
			hideLoader(); 
	  }
	};

	request.onerror = function() {
		message("Could not get you a key => no connexion :-(");
		hideLoader(); 
	};

	request.send(JSON.stringify(params));			
}

function doImport(){
	showLoader();  
	let home = "https://jsonblob.com/api/jsonBlob/";
	var request = new XMLHttpRequest();
	request.open('GET', home+"/"+cloudkey, true);
	message("");
	message("","key-message");
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
		}
		
		let letsGo = true;
		if(letsGo){
			toStorage.addall(remoteData);
			let list = toStorage.getList();
			checkData(list);
			treeData = prepareData(list);
	
			appTodo.treeDatas = treeData;
						
			message("You precious data is back !");
			hideLoader();  
		}
					
	  } else {
			message("We reached our target server, but it returned an error :-(");
			showKeyInput(cloudkey);
			hideLoader();  
	  }
	};

	request.onerror = function() {
		message("There was a connection error of some sort :-(");
		hideLoader();  
	};

	request.send();	
}

function doExport(){
	showLoader();  
	let home = "https://jsonblob.com/api/jsonBlob/"
	var request = new XMLHttpRequest();
	var params = appTodo.treeData.childrenList;
	request.open('PUT', home+cloudkey, true);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	message("");
	message("","key-message");
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
			message("You precious data is saved !");
			hideLoader(); 
	  } else {
			message("We reached our target server, but it returned an error :-(");
			hideLoader(); 
	  }
	};

	request.onerror = function() {
		message("There was a connection error of some sort :-(");
		hideLoader(); 
	};

	request.send(JSON.stringify(params));		
}

function message(msg,altId){
	let id = altId || "message";
	let ptr = document.getElementById(id);
	if(ptr){
		ptr.innerHTML = msg;
	}
}


