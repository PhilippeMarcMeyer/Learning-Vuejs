
firebase= firebase.initializeApp({
  apiKey: 'AIzaSyCdE3mJVWexNDOh83rNA5S29N2KK5gcy-c',
  authDomain: 'first-firebase-project-5ada0.firebaseapp.com',
  projectId: "first-firebase-project-5ada0"
});

var db = firebase.firestore();

let toStorage = new storageList("todo-work");


Vue.component('todo-item', {
  props: ['todo'],
  template: `<li v-bind:class="{inactive: todo.done}" >
				<div v-bind:id="todo.id" @click="handleClick(todo.id)" v-bind:class="{'noDrop':todo.done}" :draggable="!todo.done" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)">
					<b>{{ todo.toDoTitle }}</b>
					<i class="fa fa-trash icon-right" @click="handleTrash(todo.id)"></i>
					<i v-bind:class="{'fa-eye': todo.done,'fa-eye-slash': !todo.done}" class="fa icon-right" @click="handleHide(todo.id)"></i>
					<br />
					<span class='pre'>{{ todo.toDoSummary }}</span>
				</div>
			</li>`,
 methods: {
  	handleClick(id) {
		appTodo.updateId = id;
		appTodo.showUpdate();
    },  	
	handleTrash(id) {
		appTodo.updateId = id;
		appTodo.itemTrash();
		event.stopPropagation();
    },
	handleHide(id) {
		appTodo.updateId = id;
		appTodo.itemHide();
		event.stopPropagation();
    }
  }
});

var appTodo = null;
db.collection("todo-work").get().then((querySnapshot) => {
	querySnapshot.forEach(function(doc){
		toStorage.listArr.push({"key":doc.id,"data":doc.data()});
	});

	appTodo = new Vue({
	  el: '#app-7',
	  data: {
		toStorage : toStorage,
		toDoTitle : '',
		toDoSummary : '',
		btnAddTitle: 'Add task',
		addMode : 'add',
		updateId:null,
		message:'',
		workListRaw: toStorage.getList()
	  },
	  computed:{
			workList : function(){
				let temp = [];
				this.workListRaw.forEach(function(x){
					temp.push(x.data);
				});
				return temp.sort(function(a,b){
					return a.order < b.order ? 1:-1;	
				});
			}
	  },
		methods: {
			inverse:function(sourceId,targetId){
				let srcOffset = -1;
				let destOffset = -1;
				let srcOrder = -1;
				let destOrder= -1;
				this.workList.forEach(function(x,i){
					if(x.id == sourceId){
						srcOffset = i;
						srcOrder = x.order;
					}
					if(x.id == targetId){
						destOffset = i;
						destOrder = x.order;
					}
				});
				if(srcOrder !=-1 && destOrder!=-1){
					this.toStorage.changeOrders([{id:sourceId,order:destOrder},{id:targetId,order:srcOrder}],"id","order");
					this.workListRaw = toStorage.getList();
			
				}
			},
			itemTrash:function(){
				if(this.updateId!=null){
					let updateId = this.updateId;
					let data = null;
					let offset = -1;
					this.workList.forEach(function(x,i){
						if(x.id == updateId){
							data = x;
							offset = i;
						}
					});
					if(data!=null && offset!=-1){
						this.toStorage.remove(data,"id");
						this.workList.splice(offset, 1);
					}
				}
			},
			itemHide:function(){
				if(this.updateId!=null){
					let updateId = this.updateId;
					let data = null;
					this.workList.forEach(function(x){
						if(x.id == updateId){
							data = x;
						}
					});
					if(data!=null){
						data.done  = !data.done;
						data.order = data.order*-1
						this.toStorage.add(data,"id");
					}
				}
			},
			cancel:function(){
				this.updateId = null;
				this.toDoTitle = "";
				this.toDoSummary = "";
				this.btnAddTitle = "Add task";
				this.addMode = "add";
			},
			showUpdate:function(){
				if(this.updateId!=null){
					let updateId = this.updateId;
					let data = this.workList.filter(function(x){
						return x.id == updateId;
					});
					if(data.length > 0){
						if(!data[0].done){
							this.toDoTitle = data[0].toDoTitle;
							this.toDoSummary  = toTextArea(data[0].toDoSummary);
							this.btnAddTitle = "Modify";
							this.addMode = "modify";
						}else{
							this.cancel();
						}
					}
				}
			},
			addItem: function () {
				this.message = '';
				if(this.toDoTitle !=''){
					if(this.addMode == "add"){
						let id = Date.now();
						let newTodo = { id: id, toDoTitle: this.toDoTitle,toDoSummary : this.toDoSummary,done : false,order : id,parentId:0};
						this.workList.push(newTodo);
							db.collection("todo-work").add(newTodo)
							.then(function(docRef) {
								toStorage.listArr.push({key:docRef.id,data:newTodo});
								
							})	
							.catch(function(error) {
								console.error("Error adding document: ", error);
							});
					}else{
						let oldToDo = null;
					if(this.updateId!=null){
						let form = {
							id : this.updateId,
							toDoTitle : this.toDoTitle,
							toDoSummary : this.toDoSummary
						}
						this.workList.forEach(function(x){
							if( x.id == form.id){
								x.toDoTitle = form.toDoTitle;
								x.toDoSummary = form.toDoSummary;
								oldToDo = x;
							}
						});
						if(oldToDo!=null){
							this.toStorage.update(oldToDo,"id");
						}
						this.cancel();
					}
				}
				}else{
					this.message = 'Didn\'t get what you want !';
				}
			}
		}
	})
});





function storageList(listName){
	this.name = listName;
	this.storageOK=true;
	this.listArr = [];
	
	this.getList = function(){
		return this.listArr;
	};
	this.add=function(data){
		
	db.collection(this.name).add(data)
	.then(function(docRef) {
		this.listArr.push({key:docRef.id,data:data});
		
	})	
	.catch(function(error) {
		console.error("Error adding document: ", error);
	});
	}
}

function storageListold(listName){
	this.name = listName;
	this.storageOK=(typeof(Storage) !== "undefined");
	this.listArr = [];
	this.init = function(){
		if (localStorage.getItem(listName)== null)
			localStorage[listName]= JSON.stringify(this.listArr);
		else {
			var vList = localStorage[listName];
			if(vList!=""){
				this.listArr = JSON.parse(vList);
			}
		}
	},
	this.changeOrders=function(data,srcProp,destProp){
		//{id:sourceId,order:destOrder,id:targetId,order:srcOrder}
		if(this.storageOK){
			let todos = null;
			if (localStorage.getItem(this.name)!= null){
				var vList = localStorage[listName];
				if(vList!=""){
					todos = JSON.parse(vList);
				}
			}
			if(todos!=null){
				data.forEach(function(x,i){
					todos.forEach(function(y,j){
						if(x[srcProp] == y[srcProp]){
							y[destProp] = x[destProp];
						}
					});
				});
				localStorage[this.name] = JSON.stringify(todos);	
			}			
		}
	}
	this.add=function(data,key){
		if(this.storageOK){
			if (localStorage.getItem(this.name)!= null){
				var vList = localStorage[listName];
				if(vList!=""){
					this.listArr = JSON.parse(vList);
				}
			}
			let offset = -1;
			this.listArr.forEach(function(x,i){
				if(x[key] == data[key]){
					offset = i;
				}
			});
			if(offset !=-1){
				this.listArr.splice(offset, 1,data);
			}else{
				this.listArr.push(data);
			}
			localStorage[this.name] = JSON.stringify(this.listArr);				
		}
	}
	this.remove=function(data,key){
		if(this.storageOK){
			if (localStorage.getItem(this.name)!= null){
				this.listArr = JSON.parse(localStorage[this.name]);
			}
			let offset = -1;
			this.listArr.forEach(function(x,i){
				if(x[key] == data[key]){
					offset = i;
				}
			});
			if(offset !=-1){
				this.listArr.splice(offset, 1);
				localStorage[this.name] = JSON.stringify(this.listArr);				
			}
		}
	}
	this.addall=function(arr){
		this.removeall();
		this.listArr = arr;
		localStorage[this.name] = JSON.stringify(this.listArr);				

	}
	this.removeall=function(){
		 localStorage.removeItem(this.name);
	}
	this.count=function(){
		if (localStorage.getItem(this.name)!= null){
			this.listArr= JSON.parse(localStorage[this.name]);
		}
		return this.listArr.length;
		
	}
	this.getList=function(){
		if (localStorage.getItem(this.name)!= null){
			this.listArr= JSON.parse(localStorage[this.name]);
		}
		return this.listArr;
	}
	this.init();
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}
function drop(ev) {
  ev.preventDefault();
  let source = ev.dataTransfer.getData("text");
  let target = ev.target.id;
  if (document.getElementById(target).className != "noDrop"){
	  if(source && target && (source != target)){
	  appTodo.inverse(source,target);
  }  
  }
}
function toTextArea(input) {
    var newline = String.fromCharCode(13, 10);
	return input.replace(/(\r\n|\n|\r)/gm,newline.toString());
}

function saveToFile(){
 let workList = JSON.stringify(appTodo.workList);	
	download(workList,"todoList_"+Date.now()+".json",'text/plain');
}

function download(data, filename, type) {
	//from https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
	// by https://stackoverflow.com/users/1458751/kanchu
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


//https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript
// from https://stackoverflow.com/users/4718434/yaya-pro

function openFile(callBack){
  var element = document.createElement('input');
  element.setAttribute('type', "file");
  element.setAttribute('id', "btnOpenFile");
  element.onchange = function(){
      readText(this,callBack);
      document.body.removeChild(this);
      }

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
}

function readText(filePath,callBack) {
    var reader;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
    var output = ""; //placeholder for text output
    if(filePath.files && filePath.files[0]) {           
        reader.onload = function (e) {
            output = e.target.result;
            callBack(output);
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }       
    return true;
}

document.getElementById('btnOpen').onclick = function(){
    openFile(function(txt){
        document.getElementById('tbMain').value = toTextArea(txt); 
			let json = JSON.parse(document.getElementById('tbMain').value );
			appTodo.workList.workList = json;
			appTodo.toStorage.addall(json);
			setTimeout(function(){
				document.location.reload(true);
			},500);
    });
}