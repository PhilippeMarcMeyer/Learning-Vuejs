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
				x.editModeTitle=false;
				x.editModeSummary=false;
			});

		}
			return this.listArr;
	  }
	this.init();
}