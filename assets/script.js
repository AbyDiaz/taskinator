// 4.1.8 add items with click button if confused 
var buttonEl = document.querySelector('#save-task');
var tasksToDoEl = document.querySelector('#tasks-to-do');

var createTaskHandler = function () {
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.textContent = ' u have more shit to do ';
    tasksToDoEl.appendChild(listItemEl);
};

buttonEl.addEventListener('click', createTaskHandler);