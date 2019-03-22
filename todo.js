
let toStorage = new storageList("todos");
var appTodo = new Vue({
  el: '#app-7',
  data: {
	toStorage : toStorage,
	toDoTitle : '',
	toDoSummary : '',
	btnAddTitle: 'Add task',
	addMode : 'add',
	updateId:null,
	message:'',
    workListRaw: toStorage.getList(),
	currentParent : null,
	toDoSubTitle : '',
	toDoSubSummary : '',
	childrenList: ''
  },
  computed:{
		workList : function(){

			let list = this.workListRaw.sort(function(a,b){
				return a.order < b.order ? 1:-1;	
			});
			
			return list;
		}
  },
  filters:{
	  capitalize:function(value){
		  if(!value) return "";
		  value = value.toString();
		  return value.charAt(0).toUpperCase()+value.slice(1);
	  }
	  
  },
  methods: {
		 handleSubClick: function(id){
			event.stopPropagation(); 
		 },
		 handleClickChildren : function(id){
			 if(this.currentParent != id){
				 this.currentParent = id;
				let data = this.workList.filter(function(x){
					return x.id == id;
				});
				if(data.length >0){
					let children = [];
					let childrenList ="";
					if(data[0].childrenList.length >0){
							childrenList+="<ul>";
						data[0].childrenList.forEach(function(x){
							childrenList+="<li>";
							childrenList+="<b>"+x.toDoTitle+"</b>";
							childrenList+="<p>"+x.toDoSummary+"</p>";
							childrenList+="</li>";
						});
						childrenList+="</ul>";
						this.childrenList+=childrenList;

					}
				}
			 }else{
				this.currentParent = null; 
				this.childrenList =""

			 }
			event.stopPropagation();
		 },
		handleClick:function(id) {
			this.updateId = id;
			this.showUpdate();
		},  	
		handleTrash :function(id) {
			this.updateId = id;
			this.itemTrash();
			event.stopPropagation();
		},
		handleHide:function(id){
			this.updateId = id;
			this.itemHide();
			event.stopPropagation();
		},
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
					this.toDoTitle = data[0].toDoTitle;
					this.toDoSummary  = toTextArea(data[0].toDoSummary);
					this.btnAddTitle = "Modify";
					this.addMode = "modify";
				}
			}
		},
		addSubItem : function(){
			if(this.toDoSubTitle !='' && this.currentParent!=null){
				let id = Date.now();
				let newTodo = { id: id, toDoTitle: this.toDoSubTitle,toDoSummary : this.toDoSubSummary,done : false, order : id, parentId : this.currentParent};
				//this.workList.push(newTodo);
				this.toStorage.add(newTodo,"id");	
			}
		},
		addItem: function () {
			this.message = '';
			if(this.toDoTitle !=''){
				if(this.addMode == "add"){
					let id = Date.now();
					let newTodo = { id: id, toDoTitle: this.toDoTitle,toDoSummary : this.toDoSummary,done : false, order : id, parentId : 0};
					this.workList.push(newTodo);
					this.toStorage.add(newTodo,"id");
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
						this.toStorage.add(oldToDo,"id");
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
function storageList(listName){
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
		this.listArr = [];
		if (localStorage.getItem(this.name)!= null){
			this.listArr= JSON.parse(localStorage[this.name]);
		
			this.listArr.forEach(function(x){
				if(x.childrenNr == undefined){
					x.childrenNr =0;
				}
				if(x.childrenList== undefined){
					x.childrenList = [];
				}
				if(x.parentId == undefined){
					x.parentId =0;
				}
			});
			let list = this.listArr.filter(function(x){
				return x.parentId == 0;	
			});
			let secondList = this.listArr.filter(function(x){
				return x.parentId != 0;	
			});
			list.sort(function(a,b){
				return a.order < b.order ? 1:-1;	
			});
			
			list.forEach(function(x){
				x.childrenList = [];
				x.childrenNr = 0;	
				if(secondList.length>0){
					secondList.forEach(function(y){
						if(y.parentId == x.id){
							x.childrenNr +=1;
							x.childrenList.push(y);
						}
					});
				}
			});
			this.listArr = list;
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
  let target = ev.currentTarget.id;
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