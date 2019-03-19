//

var app1 = new Vue({
  el: '#app-1',
  data: {
    message: 'Hello Vue.js!'
  }
})

var app2 = new Vue({
  el: '#app-2',
  data: {
    message: "The title is talking to you !"
  }
})

var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})

var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Learn Vue' },
      { text: 'Build something awesome' }
    ]
  }
})

var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})

var app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello Vue!'
  }
})

// Define a new component called todo-item
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app7 = new Vue({
  el: '#app-7',
  data: {
	tempItem : '',
	maxId : 2,
	message:'',
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' }
    ]
  },
    methods: {
    addItem: function () {
		this.message = '';
		if(this.tempItem !=''){
			let alreadyInList = false;
			let comparableItem = this.tempItem.toLowerCase();
			this.groceryList.forEach(function(x){
				if(x.text.toLowerCase() == comparableItem){
					alreadyInList = true;
				}
			});
			 if(alreadyInList){
				 this.message = 'Already in the list !';
			 }else
			 {
				this.maxId ++;
				this.groceryList.push({ id: this.maxId, text: this.tempItem  });
			 }
		}else{
			this.message = 'Didn\'t get what you want !';
		}
    }
  }
})