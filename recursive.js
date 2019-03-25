let toStorage = new storageList("todos");
let list = toStorage.getList().sort(function(a,b){
	return a.order < b.order ? 1:-1;	
});


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
    item: Object,
	
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
	  }
	  
  },
  methods: {
    toggle: function () {
      if (this.isParent) {
        this.isOpen = !this.isOpen
      }
    },
    makeParent: function (item) {
		if(!this.isOpen  && item.childrenList.length == 0){
			this.addItem(item);
		}
		this.isOpen = !this.isOpen;
    },
	handleTrash:function(item){
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
    },
	editTitle:function(item){
		item.editModeTitle=true;
	},
	saveTitle:function(item){
		// todo : save to storage
		item.editModeTitle=false;
	},
	editSummary:function(item){
		item.editModeSummary=true;
	},
	saveSummary:function(item){
		// todo : save to storage
		item.editModeSummary=false;
	}
  }
})

var deleteElement = function(tree,item){
	let id = item.id;
		let parentId = item.parentId;
		let offset = -1;
		tree.forEach(function(x,i){
			if(x.id == id){
				offset = i;
			}
			if(x.id == parentId){
				deleteElement(x.childrenList,item);
			}
		});
		
		if(offset != -1){
			tree.splice(offset,1);
		}else{
			tree.forEach(function(x,i){
				x.childrenList.forEach(function(y,i){
				if(y.id == id){
					offset = i;
				}
				if(y.id == parentId){
					deleteElement(y.childrenList,item);
				}
			});	
		});	
	}
}

// boot up the demo
var appTodo = new Vue({
  el: '#todoList',
  data: {
    treeData: treeData
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
})