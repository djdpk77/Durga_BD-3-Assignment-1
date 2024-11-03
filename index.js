const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.use(cors());

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

//Function to add a new task to the task list
function add(tasks, taskId, text, priority) {
  tasks.push({ taskId: taskId, text: text, priority: priority });

  return tasks;
}

//Endpoint 1. Add a Task to the Task List
app.get('/tasks/add', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = parseInt(req.query.priority);

  tasks = add(tasks, taskId, text, priority);

  res.json({ tasks: tasks });
});

//Endpoint 2. Read All Tasks in the Task List
app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

//Function to sort the tasks by their priority in ascending order
function sortTasksByPriority(task1, task2) {
  return task1.priority - task2.priority;
}

//Endpoint 3. Sort Tasks by Priority
app.get('/tasks/sort-by-priority', (req, res) => {
  let sortedTasks = tasks.slice();
  sortedTasks.sort(sortTasksByPriority);

  res.json({ tasks: sortedTasks });
});

//Function to update the priority of a task based on the task ID
function editTaskPriorityById(tasks, taskId, priority) {
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
      break;
    }
  }
  return tasks;
}

//Endpoint 4. Edit Task Priority
app.get('/tasks/edit-priority', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let priority = parseInt(req.query.priority);

  tasks = editTaskPriorityById(tasks, taskId, priority);

  res.json({ tasks: tasks });
});

//Function to update the text of a task based on the task ID
function editTaskTextById(tasks, taskId, text) {
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
      break;
    }
  }
  return tasks;
}

//Endpoint 5. Edit/Update Task Text
app.get('/tasks/edit-text', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;

  tasks = editTaskTextById(tasks, taskId, text);

  res.json({ tasks: tasks });
});

function deleteTaskById(task, taskId) {
  return task.taskId !== taskId;
}

//Endpoint 6. Delete a Task from the Task List
app.get('/tasks/delete', (req, res) => {
  let taskId = parseInt(req.query.taskId);

  tasks = tasks.filter((task) => deleteTaskById(task, taskId));

  res.json({ tasks: tasks });
});

//Function to return tasks that match a specified priority
function filterTasksByPriority(task, priority) {
  return task.priority === priority;
}

//Endpoint 7. Filter Tasks by Priority
app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseInt(req.query.priority);

  let filteredtasks = tasks.filter((task) =>
    filterTasksByPriority(task, priority)
  );

  res.json({ tasks: filteredtasks });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
