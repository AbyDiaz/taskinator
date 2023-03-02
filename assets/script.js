var taskIdCounter = 0;

// 4.1.8 add items with click (event listener) button if confused 
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var pageContentEl = document.querySelector('#page-content');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');

var tasks = [];

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input vvalues are empty strings
    if(!taskNameInput || !taskTypeInput) {
        alert ('Seriously dude! youre missing some info');
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute , so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name :taskNameInput,
            type :taskTypeInput,
            status : 'to do'
        };

        createTaskEl(taskDataObj)
    }

};

var createTaskEl = function(taskDataObj) {

    // create list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    // add task id as custom attribute
    listItemEl.setAttribute('data-task-id', taskIdCounter);
    
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement('div');
    // give it a class name
    taskInfoEl.className = 'task-info';
    // add HTML content to div
    taskInfoEl.innerHTML = 
        "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    // appending taskActionsEl to listItemEl
    listItemEl.appendChild(taskActionsEl);

    switch (taskDataObj.status) {
            case 'to do':
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
                tasksToDoEl.append(listItemEl);
            break;
            case 'in progress':
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
                tasksToDoEl.append(listItemEl);
            break;
            case 'completed' :
                taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
                tasksToDoEl.append(listItemEl);
            break;
            default:
                console.log('oopsie whoopsie something went wrong here');     
    }

    // save tasks as an object with name, type, status, and id properties 
    taskDataObj.id = taskIdCounter;

    // then push into tasks array 
    tasks.push(taskDataObj);

    // save tasks to local storage 
    saveTasks();

    // increase task counter for next unique id 
    taskIdCounter++;
    
}


var createTaskActions = function(taskId) {
    // create container to hold elements
    var actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    // create edit button
    var editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl); 

    // create delete button
    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create change status dropdown
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    // var i = 0 defines an inital counter, iterator, or variable
    // i < statusChoices.length keeps the for loop running by checking interator against number of items in array (length being property that returns number of items)
    // i++ increments counter by one after each loop iteration
    // statusChoices[i] returns value of array at given index
    // ex. for above, when i = 0 of statusChoices[0], we get the first item 
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;

}

var completeEditTask = function(taskName, taskType, taskId) {
     
    // find task list item with taskId value
    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );

    // set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    // loop through tasks array and task objects with new content
     for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }; 

    alert(' Task Updated '); 

    // remove data attribute from from
    formEl.removeAttribute('data-task-id');
    // update formEl button to go back to saying "Add Task" isntead of "Edit Task"
    document.querySelector('#save-task').textContent = 'Add Task';
    // save tasks to local storage 
    saveTasks();
};


var taskButtonHandler = function(event) {

    // get target element from event 
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }

};

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
    
    // find task list item based on event.targets data-task-id attribute
    var taskId = event.target.getAttribute('data-task-id');

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );

    // get currentlt selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // handles moving the task from column to column depending on what the select option is on
    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update tasks in task array 
    for (var i = 0; i < tasks.lenght; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    } 

 saveTasks();

};

var editTask = function(taskId) {

    // get task list item element 
    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );

    // get content from task name and type
    var taskName = taskSelected.querySelector('h3.task-name').textContent;

    var taskType = taskSelected.querySelector('span.task-type').textContent;

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // set data attribute to the form with a value of the tasks id so it knows which one is being edited
    formEl.setAttribute('data-task-id', taskId);

    // update forms button to reflect editing a task rather than creating a new one
    formEl.querySelector('#save-task').textContent = 'Save Task';
};

var deleteTask = function(taskId) {
    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    taskSelected.remove();

    // create new array to hold updated list of tasks 
    var updatedTaskArr = [];

    // loop through current tasks
    for(var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesnt match the value of taskId, lets keep that task and push it into the new array 
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    } 

    // reassign tasks array to be the same as updatesTasksArr
    tasks = updatedTaskArr;

    saveTasks();
};  

var saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

var loadTasks = function() {
    var savedTasks = localStorage.getItem('tasks');
    if(!saveTasks) {
        return false;
    }
    console.log('saved tasks found');

    savedTasks = JSON.parse(savedTasks);

    for (var i = 0; i < savedTasks.length; i++) {
        createTaskEl(saveTasks[i]);
    }

    //var reloadPg = JSON.parse(window.localStorage.getItem('tasks'));
    
    // get task items from local storage
   /* var reloadPg = window.localStorage.getItem(tasks);
    var reloadPg = window.localStorage.getItem('tasks');
    // converts tasks from a string back into an array of objects 
    tasks = JSON.parse(reloadPg);

    // itterate through a tasks array and create task elements on the page from it 
    for (var i = 0; i < tasks.length; i++) {
        
        tasks[i].id = taskIdCounter;

        var listItemEl = document.createElement('li');
        listItemEl.className = 'task-item';
        listItemEl.setAttribute('data-task-id', tasks[i].id);

        var taskInfoEl = document.createElement('div');
        taskInfoEl.className = 'task-info';
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);

        if (tasks[i].status === 'to do') {

            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);

        } else if (tasks[i].status === 'in progress') {

            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);

        } else if (tasks[i].status === 'complete') {

            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter++;
        console.log(listItemEl);
    }*/

};


formEl.addEventListener('submit', taskFormHandler);

pageContentEl.addEventListener('click', taskButtonHandler);

pageContentEl.addEventListener('change', taskStatusChangeHandler);

loadTasks();