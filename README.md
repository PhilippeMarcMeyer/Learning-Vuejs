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

- Back-up you data to use from another computer : "Save to the clouds" button

- Retrieve you data from the cloud by clicking on 'Let it rain"

03/27/2019 : Added sorting by drag and drop on the same branch

03/27/2019 : Added a due date (optional) with colors (orange if soon < 1 day, red if late, green otherwise)

03/28/2019 : Correction bug relative to the input title => Removing "new" to enter real title was putting back "new"

![screen shot](https://raw.githubusercontent.com/PhilippeMarcMeyer/Learning-Vuejs/master/screen.png)
