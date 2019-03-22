firebase.initializeApp({
    apiKey: "AIzaSyCdE3mJVWexNDOh83rNA5S29N2KK5gcy-c",
    authDomain: "first-firebase-project-5ada0.firebaseapp.com",
    databaseURL: "https://first-firebase-project-5ada0.firebaseio.com",
    projectId: "first-firebase-project-5ada0",
    storageBucket: "first-firebase-project-5ada0.appspot.com",
    messagingSenderId: "770548806963"
});

const db = firebase.firestore();

Vue.use(VueFire)

var appTodo = new Vue({
	el: '#app-7',
  data: {
    	toDoTitle : '',
		toDoSummary : '',
		btnAddTitle: 'Add task',
		addMode : 'add',
		updateId:null,
		message:'',
		workList: []
  },
  firestore: {
    workList: db.collection('todo-item')
  },
  methods: {
	cancel:function(){
		this.updateId = null;
		this.toDoTitle = "";
		this.toDoSummary = "";
		this.btnAddTitle = "Add task";
		this.addMode = "add";
	}
  }
})

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

