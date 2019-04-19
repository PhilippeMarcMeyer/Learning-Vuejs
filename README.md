# Vuejs todo list
Recursive ToDolist with local storage

- Recursive toDoList with any number of sub branches.

- Typing title and summary by click on them with turns them to edit fields

- LocalStorage temporary saving

- Persistent saving to https://jsonblob.com/ once you've got a key by adding one json object to the site : 

  put it on top of the cloud.js file :
  
  let key = "xxxx-xxxx-xxxx-xxx-xxxxxxxxx";
  
- Sorting by drag and drop on the same branch

- Set a task done by clicking on the eye icon : the task will dim. 

- Choose to hide the done tacks by unchecking then "Show done tasks" checkbox

- Deploy/hide the childre branches by clicking on the List icon left to the title

- Back-up you data to use from another computer : "Save to the cloud" button

- Retrieve you data from the cloud by clicking on "Get from the cloud"

03/27/2019 : Added sorting by drag and drop on the same branch

03/27/2019 : Added a due date (optional) with colors (orange if soon < 1 day, red if late, green otherwise)

03/28/2019 : Correction bug relative to the input title => Removing "new" to enter real title was putting back "new"

04/09/2019 : the button "Get from the cloud" preserves unsaved local tasks listing them in a new task called "Saved tasks"

04/11/2019 : the button "Get from the cloud" preserves unsaved local tasks putting them back in the tree

04/17/2019 : no https://jsonblob.com/api/jsonBlob/ key => hide cloud buttons.
Css : responsive and warning message under width 320px

Caching todoApp to use it offline on my phone
no drag and drop icons on touch screen

The cloud key is not in the code anymore, you've got to input it once so it is kept inside localStorage.

~~Goto to https://jsonblob.com/ and input [] inside the left field then make request POST and copy the id of your post
then past it in todoList when asked.~~

04/19/2019 : A new cloud storage key is retrieved when needed. keep your key for yourself as you will need it to access the same cloud storage form another device :-)

### I like this project not only for the Vuejs framework but for the intensive use of recursive functions :-)

### DEMO : https://philippemarcmeyer.github.io/vueTodoList/index.html

![screen shot](https://raw.githubusercontent.com/PhilippeMarcMeyer/Learning-Vuejs/master/screen.png)
