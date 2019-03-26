let toStorage = new storageList("todos");
let list = toStorage.getList().sort(function(a,b){
	return a.order < b.order ? 1:-1;	
});

let showDone = false;

if(list.length == 0){
	let child = {};
	  child.id = Date.now();
	  child.parentId = 0;
	  child.toDoTitle = "new";
	  child.toDoSummary = "...";
	  child.done = false;
	  child.order = child.id;
	  child.childrenList = [],
	  child.editModeTitle=true,
	  child.editModeSummary=false,
	  list.push(child);
}

function save(){
	toStorage.addall(treeData.childrenList);
}

var treeData ={
 toDoTitle: "",
 toDoSummary: "",
 id : 0,
 order:0,
 done: false,
 childrenList :list,
 childrenNr : list.length,
 parentId:0,
 editModeTitle:false,
 editModeSummary:false,
 isOpen:true
};

// define the tree-item component
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
		  let days = ["mo","tu","we","fr","sa","su"];
		  let d = new Date(value);
		  let result = days[d.getDay()] +" "+ d.getDate()+"-" + months[d.getMonth()] +"-" + d.getFullYear() +" " + d.getHours() +":" + d.getMinutes();
		  return result;
	  }
  },
  methods: {

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
	  child.id = Date.now();
	  child.parentId = item.id;
	  child.toDoTitle = "new";
	  child.toDoSummary = "...";
	  child.done = false;
	  child.order = child.id;
	  child.childrenList = [],
	  child.editModeTitle=true,
	  child.editModeSummary=false,
	  item.childrenList.push(child);
	  save();
    },
	editTitle:function(item){
		message("");
		item.editModeTitle=true;
	},
	saveTitle:function(item){
		message("");
		if(item.toDoTitle.trim() == ""){
			item.toDoTitle="new"
		}
		save();
		item.editModeTitle=false;
	},
	editSummary:function(item){
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
})

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

//  appTodo.treeData.childrenList
var appTodo = new Vue({
  el: '#todoList',
  data: {
    treeData: treeData,
	showDone : true
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
	  child.editModeTitle=true,
	  child.editModeSummary=false,
	  item.childrenList.push(child);
    }
  }
});


let classList = appTodo.showDone ? 'fa fa-check-square' : 'fa fa-square';
let showTasks = document.getElementById("showTasks");
showTasks.className = classList;
showTasks.addEventListener("click", function(){
	appTodo.showDone = !appTodo.showDone;
	let classList = appTodo.showDone ? 'fa fa-check-square' : 'fa fa-square';
	this.className = classList;
	document.getElementById("todoList").className = appTodo.showDone ? "done-show" : "done-hide" ;
});

