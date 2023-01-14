// 4.1.8 add items with click (event listener) button if confused 
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var taskIdCounter = 0;

var taskFormHandler = function (event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;

    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input vvalues are empty strings
    if(!taskNameInput || !taskTypeInput) {
        alert ('Seriously dude! youre missing some info');
        return false;
    }

    formEl.reset(); 

    // package up data as an object
    var taskDataObj = {
        name : taskNameInput,
        type : taskTypeInput
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);

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
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    // appending taskActionsEl to listItemEl
    listItemEl.appendChild(taskActionsEl);
    
    // then appending listItemEl to the page
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id 
    taskIdCounter++;
    
}

var createTaskActions = function(taskId) {

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

formEl.addEventListener('submit', taskFormHandler);