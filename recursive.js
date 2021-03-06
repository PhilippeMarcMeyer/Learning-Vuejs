// globals :
let showDone = false;
let appTodo = null;
let toStorage = null;
let treeData  = null;
// init :
function resursiveInit() {
	
  message("<br /><h3>Please allow cookies as this app uses local storage to keep your todos...</h3>");
  toStorage = initLocalStorage();

 
 if(toStorage != null){
	message("Getting things ready...");
	document.getElementById("titleZone").style.display="block";
	document.getElementById("showTasks").style.display="block";
	document.querySelectorAll(".buttons").forEach(function(x){x.style.display="block"});
	
	let list = toStorage.getList();
	checkData(list);
	treeData = prepareData(list);
	
	loadVueComponent();
	
	if (localStorage.getItem("cloudkey")== null){
		localStorage["cloudkey"]= "";
	}
	cloudkey = localStorage.getItem("cloudkey");
	if(cloudkey == ""){
		showKeyInput();
	}else{
		hideKeyInput();
	}
	if (localStorage.getItem("showDone")== null){
		localStorage["showDone"] = true;
	}
	showDone = (localStorage.getItem("showDone") == "true");
	
	let showTasks = document.getElementById("showTasks");
	showTasks.className = showDone ? 'fa fa-check-square' : 'fa fa-square';
	
	appTodo = initApp(treeData,showDone); 
	document.getElementById("todoList").className = appTodo.showDone ? "done-show" : "done-hide";

	setListeners();
 }
 if(window.innerWidth <= 640){
	 let ptr = document.querySelector("#fullScreenToggler");
	 if(ptr){
		ptr.style.display = "inline-block";
		ptr.innerHTML = "hide bar";
	 }
 }
}
// init functions :
function initLocalStorage(){
	let toStorage = new storageList("todos");
	if(toStorage.storageOK){
		return toStorage;
	}else{
		return null;
	}
}
	
function prepareData(list){
	if(list.length == 0){
		let child = {};
		  child.id = Date.now();
		  child.parentId = 0;
		  child.toDoTitle = "new";
		  child.toDoSummary = "...";
		  child.done = false;
		  child.order = child.id;
		  child.childrenList = [],
		  child.shoppingList = null,
		  child.editModeTitle=true,
		  child.editModeSummary=false,
		  list.push(child);
	}
	let treeData ={
	 dueDate:"",
	 toDoTitle: null,
	 toDoSummary: "",
	 id : -99,
	 order:0,
	 done: false,
	 childrenList :list,
	 shoppingList : null,
	 childrenNr : list.length,
	 parentId:0,
	 editModeTitle:false,
	 editModeSummary:false,
	 isOpen:true
	};
	return treeData;
}

function loadVueComponent(){
	let iter = 0;
	Vue.component('tree-item', {
	  template: '#item-template',
	  props: {
		item: Object
	  },
	  data: function () {
		iter++;
		return {
		  isOpen:  iter == 1
		}
	  },
	  computed: {
		isParent: function () {
		  return this.item.childrenList &&
			this.item.childrenList.length
		},
		dueStatus: function(){
			let result = "none";
			let dueDate = 0;
			let delta = 0;
			let nowAndThen = Date.now();
			let soonSpan = 24*60*60*1000;
			
			if(this.item.dueDate && !this.item.done){
				dueDate = new Date(this.item.dueDate).getTime();
				delta = nowAndThen - dueDate;
				
				if(delta > 0){
					return "late";
				}else if((delta*-1) < soonSpan) {
					return "soon";
				}else{
					return "cool";
				}	
			}	
			return result;		
		}
			
	  },
		filters:{
		  capitalize:function(value){
			  if(!value) return "";
			  value = value.toString();
			  return value.charAt(0).toUpperCase()+value.slice(1);
		  },
		  getDateTime:function(value){
			  let months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
			  let days = ["mo","tu","we","th","fr","sa","su"];
			  let d = new Date(value);
			  let result = days[d.getDay()] +" "+ d.getDate()+"-" + months[d.getMonth()] +"-" + d.getFullYear() +" " + d.getHours() +":" + d.getMinutes();
			  return result;
		  },
		getDateTimeStr:function(value){
			if(value){
				return value.replace("T"," ");
			}else{
				return "";
			}
		}
	  },
	  methods: {
		  toggleShoppingDone :function(shoppinItem){
			  shoppinItem.done = !shoppinItem.done;
			  save();
		  },
		 toggleShopping :function(item){
		  if(!item.shoppingList){
			   item.shoppingList=[];
			  if(item.toDoSummary.length > 3){
				  let arr = item.toDoSummary.split(/\r\n|\n|\r/);
				  arr.forEach(function(x){
					  if(x !=""){
						 if(x.startsWith("[x] ")){
							 x = x.substring(4);
							item.shoppingList.push({"label":x,"done":true});
						 }else{
							item.shoppingList.push({"label":x,"done":false});
						 }
					  }
				  });
				
			  }
		  }else{
			  if(item.shoppingList.length){
				  item.toDoSummary = "";
				  item.shoppingList.forEach(function(x){
					  if(x.done ){
						item.toDoSummary += "[x] " + x.label + "\r\n";
					  }else{
						item.toDoSummary += x.label + "\r\n";
					  }
				  });
			  }else{
				  item.toDoSummary = "...";
			  }
			  item.shoppingList = null;
		  }
		  save();
		 },
		toggle: function () {
			message("");
		  if (this.isParent) {
			this.isOpen = !this.isOpen
		  }
		},
		makeParent: function (item) {
			message("");
			if(!this.isOpen  && item.childrenList.length == 0){
				this.addItem(item);
			}
			this.isOpen = !this.isOpen;
			save();
		},
		handleTrash:function(item){
			message("");
			let parentId = item.parentId;
			if(parentId == 0){
				let offset = -1;
				treeData.childrenList.forEach(function(x,i){
					if(x.id == item.id){
						offset = i;
					}
				});
				if(offset != -1){
					if(treeData.childrenList.length >1){
						treeData.childrenList.splice(offset, 1);
					}else{
						treeData.childrenList[0].toDoTitle="new";
						treeData.childrenList[0].toDoSummary="...";
						treeData.childrenList[0].childrenList=[];
					}
				}
			}else{
				deleteElement(treeData.childrenList,item);
			}
			save();
		},
		addItem: function (item) {
			message("");
			let child = {};
			child.dueDate="",
			child.id = Date.now();
			child.parentId = item.id;
			child.toDoTitle = "new";
			child.toDoSummary = "...";
			child.done = false;
			child.order = child.id;
			child.childrenList = [],
			child.childrenNr =0,
			child.editModeTitle=true,
			child.editModeSummary=false,
			item.childrenList.push(child);
			save();
		},
		editTitle:function(item){
			if(item.id == -99) return;
			message("");
			item.editModeTitle=true;
		},
		saveTitle:function(item){
			message("");
			if(item.toDoTitle.trim() != ""){
				save();
				item.editModeTitle=false;
			}
		},
		editSummary:function(item){
			if(item.id == -99) return;
			message("");
			item.editModeSummary=true;
		},
		saveSummary:function(item){
			message("");
			// todo : save to storage
			if(item.toDoSummary.trim() == ""){
				item.toDoSummary="..."
			}
			save();
			item.editModeSummary=false;
		},
		handleHide : function(item){
			item.done = !item.done;
			item.order = item.order *-1;
			setDoneChildren(item.childrenList,item.done);
		}
	  }
	});
}

function initApp(treeData,showDoneTasks){
	return new Vue({
	  el: '#todoList',
	  data: {
		treeDatas: treeData,
		showDone : showDoneTasks
	  },
	  computed:{
		treeData: function () {
			let list = this.treeDatas;
			sortBranches(list);
			return list;
		}
	  },
	  methods: {
		makeParent: function (item) {
		  Vue.set(item, 'childrenList', [])
		  this.addItem(item)
		},
		addItem: function (item) {
			
		let child = {};
		  child.id = Date.now();
		  child.parentId = item.id;
		  child.toDoTitle = "new";
		  child.toDoSummary = "...";
		  child.done = false;
		  child.order = child.id;
		  child.childrenList = [],
		  child.shoppingList = null,
		  child.editModeTitle=true,
		  child.editModeSummary=false,
		  item.childrenList.push(child);
		},
		inverse:function(source,target){
			let srcId = source.id;
			let destId = target.id;
			let parentId = source.parentId;
			setInverse(treeData.childrenList,parentId,srcId,destId);
		}
	  },beforeCreate : function(){
			showLoader();  
		},
		mounted : function(){
			hideLoader();  
			message("Welcome back !");
		},
	});
}

function setListeners(){
	let classList = appTodo.showDone ? 'fa fa-check-square' : 'fa fa-square';
	let showTasks = document.getElementById("showTasks");
	showTasks.className = classList;
	showTasks.addEventListener("click", function(){
		appTodo.showDone = !appTodo.showDone;
		let classList = appTodo.showDone ? 'fa fa-check-square' : 'fa fa-square';
		this.className = classList;
		document.getElementById("todoList").className = appTodo.showDone ? "done-show" : "done-hide";
		localStorage["showDone"] = appTodo.showDone;
	});
	let setCloudKeyPtr = document.getElementById("setCloudKey");
	setCloudKeyPtr.addEventListener("click", function(){
		cloudkey =  document.getElementById("cloudKeyValue").value;
		localStorage["cloudkey"] = cloudkey;	
		if(cloudkey == ""){
			getNewKey(function(){
				document.getElementsByClassName("getCloudKey")[0].style.display="none";
				document.querySelectorAll(".buttons").forEach(function(x){x.style.display="block"});
			});
		}else{
			document.getElementsByClassName("getCloudKey")[0].style.display="none";
			document.querySelectorAll(".buttons").forEach(function(x){x.style.display="block"});
		}
	});
		let cloudKeyHidePtr = document.getElementById("cloudKeyHide");
		cloudKeyHidePtr.addEventListener("click", function(){
		document.getElementsByClassName("getCloudKey")[0].style.display="none";
		message("You can still use TodoList on this device :-)");
	});
	document.getElementById("fullScreenToggler").addEventListener("click", function(){
		if (document.fullscreenElement) { 
			document.exitFullscreen();
			this.innerHTML = "hide bar"
		} else { 
			document.documentElement.requestFullscreen();
			this.innerHTML = "show bar"
		} 
	});
	
	document.querySelector(".buttons .fas").addEventListener("click", function(){
		let ptr = document.querySelector("#key-message");
		let presentMsg = ptr.innerHTML;
		if(presentMsg == ""){
			message("Your cloudkey is : <br />" + cloudkey + "<br />Copy it to use it on another device ;-)","key-message");
		}else{
			message("","key-message");
		}
	});

	document.querySelector("#titleZone .fas").addEventListener("click", function(){
		let ptr = document.querySelector("#key-message");
		let presentMsg = ptr.innerHTML;
		if(presentMsg != ""){
			message("","key-message");
		}else{
			message("Todo list keeps your tasks on this device.<br />In order to use them on another device, you need a cloud-storage key which todo list will get for you.<br />Copy your key to use it on the other device so the cloud storage will be the same every where :-)","key-message");
			
		}
	});

}
// utilities :
var setInverse = function(tree,parentId,srcId,destId){
	if(parentId == 0){
		let offsetSrc = -1;
		let offsetDest = -1;
		for (let i = 0 ; i < tree.length;i++){
			if(tree[i].id == srcId){
				offsetSrc = i;
			}
			if(tree[i].id == destId){
				offsetDest = i;
			}
		}
		if(offsetSrc != -1 && offsetDest !=-1){
			let temp = tree[offsetSrc].order;
			tree[offsetSrc].order = tree[offsetDest].order;
			tree[offsetDest].order = temp;
		}
	}
	else{
		let found = false;
		for (let i = 0 ; i < tree.length;i++){
			if(tree[i].id  == parentId){
				if(tree[i].childrenList.length != 0){
					found = true;
					let offsetSrc = -1;
					let offsetDest = -1;
					for (let j = 0 ; j < tree[i].childrenList.length;j++){
						if(tree[i].childrenList[j].id == srcId){
							offsetSrc = j;
						}
						if(tree[i].childrenList[j].id == destId){
							offsetDest = j;
						}
					}
					if(offsetSrc != -1 && offsetDest !=-1){
						let temp = tree[i].childrenList[offsetSrc].order;
						tree[i].childrenList[offsetSrc].order = tree[i].childrenList[offsetDest].order;
						tree[i].childrenList[offsetDest].order = temp;
					}
				}
				break;
			}
		}
		if(!found){
			for (let i = 0 ; i < tree.length;i++){
				if(tree[i].childrenList.length != 0){
					setInverse(tree[i].childrenList,parentId,srcId,destId);
				}
			}
		}
	}
}

var setDoneChildren = function(tree,isDone){
		tree.forEach(function(x,i){
		x.done = isDone;
		x.order = x.order *-1;
		if(x.childrenList.length != 0){
			setDoneChildren(x.childrenList,isDone);
		}
	});
	save();
}

var deleteElement = function(tree,item){
	let id = item.id;
	let parentId = item.parentId;
	let offset = -1;
	tree.forEach(function(x,i){
		if(x.id == id){
			offset = i;
		}
		deleteElement(x.childrenList,item);
	});
		
	if(offset != -1){
		tree.splice(offset,1);
	}
}

function sortBranches (tree){
	if(!Array.isArray(tree)){
		tree = tree.childrenList;
	}
	tree.sort(function(a,b){
		return a.order < b.order ? 1:-1;
	});
	tree.forEach(function(x,i){
		if(x.childrenList.length != 0){
			sortBranches(x.childrenList);
		}
	});
}

function checkData(tree){
	if(!Array.isArray(tree)){
		tree = tree.childrenList;
	}
	tree.forEach(function(x){
		if(x.childrenNr == undefined){
			x.childrenNr =0;
		}
		if(x.childrenList== undefined){
			x.childrenList = [];
		}
		if(x.parentId == undefined){
			x.parentId =0;
		}
		if(x.dueDate == undefined){
			x.dueDate = "";
		}
	});
	tree.forEach(function(x,i){
		if(x.childrenList.length != 0){
			checkData(x.childrenList);
		}
	});
}

function save(){
	toStorage.addall(treeData.childrenList);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text/plain", JSON.stringify({id:ev.target.id,parentId:ev.target.dataset.parent}));
}

function drop(ev) {
  ev.preventDefault();
  let source = JSON.parse(ev.dataTransfer.getData("text"));
  let target = {id:ev.target.id,parentId:ev.target.dataset.parent};
  
  if (document.getElementById(target.id).className != "noDrop"){
	  if(source.id && target.id && (source.id != target.id) && (source.parentId == target.parentId)){
	  appTodo.inverse(source,target);
  }  
  }
}

function treeFlatten(tree,flatArray){
	if(!Array.isArray(tree)){
		tree = tree.childrenList;
	}
	if(!flatArray){
		flatArray = [];
	}
	tree.forEach(function(x,i){
		let node = JSON.parse(JSON.stringify(x));
		node.childrenList = [];
		flatArray.push(node);
		if(x.childrenList.length != 0){
			treeFlatten(x.childrenList,flatArray);
		}
	});
	return flatArray;
}

function mergeSavedTasks(savedTasks,tree){
	if(!Array.isArray(tree)){
		tree = tree.childrenList;
	}
    let rootTasks = savedTasks.filter(function(x){
		return x.parentId==-99;
	});;
	
	rootTasks.forEach(function(x,i){
		tree.push(x);
	});
	
	let nonRootTasks = savedTasks.filter(function(x){
		return x.parentId!=-99;
	});
	let foundTasks = []
	mergeSavednonRootTasks(nonRootTasks,tree,foundTasks);
	
}

function mergeSavednonRootTasks(nonRootTasks,branch,foundTasks){
	nonRootTasks.forEach(function(x,i){
		branch.forEach(function(y,i){
			if(x.parentId == y.id){
				foundTasks.push(x.id);
				y.childrenList.push(x);
			}else{
				if(y.childrenList!= null && y.childrenList.length >0){
					let taskList = nonRootTasks.filter(function(x){
						return foundTasks.indexOf(x.id) == -1;
					});
					if(taskList.length >0){
						mergeSavednonRootTasks(taskList,y.childrenList,foundTasks)
					}
				}	
			}
		});
	});
}

function showKeyInput(cloudkey){
	document.querySelectorAll(".buttons").forEach(function(x){x.style.display="none"});
	document.getElementsByClassName("getCloudKey")[0].style.display="block";
	if(cloudkey){
		document.getElementsByClassName("getCloudKey")[0].value = cloudkey;
	}
}

function hideKeyInput(){
	document.querySelectorAll(".buttons").forEach(function(x){x.style.display="block"});
	document.getElementsByClassName("getCloudKey")[0].style.display="none";
}

function showLoader() {
	let loaderElt = document.getElementById("loader");
    if (loaderElt) { 
		document.getElementById("loader_anim").style.display="block";
       loaderElt.style.display="block";
    }
}

function hideLoader() {
	let loaderElt = document.getElementById("loader");
    if (loaderElt) { 
		document.getElementById("loader_anim").style.display="none";
       loaderElt.style.display="none";
    }
}
window.onresize = function(){
	let ptr = document.querySelector("#fullScreenToggler");
	if(ptr != null){
		if(window.innerWidth <= 640){
			ptr.style.display = "inline-block";
		}else{
			ptr.style.display = "none";
		} 
		if (document.fullscreenElement) { 
			ptr.innerHTML = "show bar"
		} else { 
			ptr.innerHTML = "hide bar"
		} 
	}
};

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    value: function(search, pos) {
      pos = !pos || pos < 0 ? 0 : +pos;
      return this.substring(pos, pos + search.length) === search;
    }
  });
}
