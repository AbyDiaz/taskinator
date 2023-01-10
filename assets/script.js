// 4.1.8 add items with click (event listener) button if confused 
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');

var createTaskHandler = function (event) {

    event.preventDefault();

    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.textContent = ' u have more shit to do ';
    tasksToDoEl.appendChild(listItemEl);

    console.log(event);
};

formEl.addEventListener('submit', createTaskHandler);