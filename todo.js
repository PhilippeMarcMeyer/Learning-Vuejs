

// Define a new component called todo-item
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}<br /><span>{{ todo.subText }}</span></li>'
})

let toStorage = new storageList("todos");
var app7 = new Vue({
  el: '#app-7',
  data: {
	toStorage : toStorage,
	tempItem : '',
	tempSubItem : '',
	maxId : toStorage.getOffset(),
	message:'',
    workList: toStorage.getList()
  },
    methods: {
		addItem: function () {
			this.message = '';
			if(this.tempItem !=''){
				let alreadyInList = false;
				let comparableItem = this.tempItem.toLowerCase();
				this.workList.forEach(function(x){
					if(x.text.toLowerCase() == comparableItem){
						alreadyInList = true;
					}
				});
				 if(alreadyInList){
					 this.message = 'Already in the list !';
				 }else
				 {
					this.maxId++;
					let newTodo = { id: this.maxId, text: this.tempItem,subText : this.tempSubItem,done : false,order : this.maxId};
					this.workList.push(newTodo);
					this.toStorage.add(newTodo);
				 }
			}else{
				this.message = 'Didn\'t get what you want !';
			}
		}
	}
})


function storageList(listName){
	this.Offset=1;
	this.name = listName;
	this.storageOK=(typeof(Storage) !== "undefined");
	this.listArr = [];

	this.setOffset = function(){
		this.Offset=0;
		this.listArr.forEach(function(x){
			if(x.id > this.Offset){
				this.Offset = x.id;
			}
		});
		this.Offset++;
	},
	this.getOffset = function(){
		return this.Offset;
	},
	this.init = function(){
		if (localStorage.getItem(listName)== null)
			localStorage[listName]= JSON.stringify(this.listArr);
		else {
			var vList = localStorage[listName];
			if(vList!=""){
				this.listArr = JSON.parse(vList);
			}
			this.setOffset();
		}
	},
	this.add=function(clef){
		if(this.storageOK){
			if (localStorage.getItem(this.name)!= null){
				var vList = localStorage[listName];
				if(vList!=""){
					this.listArr = JSON.parse(vList);
				}
			}
			var pos = this.listArr.indexOf(clef);
			if(pos==-1){
				this.listArr.push(clef);
				localStorage[this.name] = JSON.stringify(this.listArr);				
			}
		}
		this.setOffset();
	}
	this.remove=function(clef){
		if(this.storageOK){
			if (localStorage.getItem(this.name)!= null){
			this.listArr = JSON.parse(localStorage[this.name]);
			}
			var pos = this.listArr.indexOf(clef);
			if(pos!=-1){
				this.listArr.splice(pos,1);
				localStorage[this.name] = JSON.stringify(this.listArr);					
			}
		}
	}
	this.addall=function(arr){
		this.removeall();
		for(var i = 0; i < arr.length;i++){
			this.add(arr[i]);
		}
		this.setOffset();
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