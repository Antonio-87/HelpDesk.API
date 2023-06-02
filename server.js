const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('koa2-cors');
const { v4: uuidv4 } = require('uuid');
const formatDate = require('./formatDate');
const Task = require('./Task');
const TaskFull = require('./TaskFull');

const app = new Koa();
const router = new Router();

let tasks = [];
let tasksFull = [];

app.use(cors());

// создание новой задачи (принимает formData)
router.post('/createTask', async (ctx, next) => {
  const { name, description, status } = ctx.request.body;
  const uniqueId = uuidv4();
  const date = formatDate(Date.now());
  if (tasks.some(task => task.id !== id)) {
    const task = new Task(uniqueId, name, status, date);
    const taskFull = new TaskFull(uniqueId, name, description, status, date);
    tasks.push(task);
    tasksFull.push(taskFull);
    ctx.status = 201; // Created
    ctx.body = { task };
    return;
  }
  
  ctx.throw(304, 'Already have a task with that name');
});

// получение всех задач (массив объектов Task)
router.get('/allTasks', async (ctx, next) => {
  ctx.body = { tasks };
});

// получение задачи по id (объект TaskFull)
router.get('/tasks/:id', async (ctx, next) => {
  const task = tasksFull.find(task => task.id === parseInt(ctx.params.id));
  task
    ? ctx.body = { task }
    : ctx.throw(404, 'Task not found');
});

// обновление задачи по id
router.put('/tasks/:id', async (ctx, next) => {
  const task = tasks.find(task => task.id === parseInt(ctx.params.id));
  const taskFull = tasksFull.find(task => task.id === parseInt(ctx.params.id));
  if (!task && !taskFull) {
    ctx.throw(404, 'Task not found');
  } else {
    const { name, description, status } = ctx.request.body;
    task.name = name || task.name;
    taskFull.name = task.name;
    taskFull.description = description || taskFull.description;
    task.status = status || task.status;
    taskFull.status = task.status;
    ctx.status = 200;
    ctx.body = { task };
  }
});

// удаление задачи по id
router.delete('/tasks/:id', async (ctx, next) => {
  const indexTask = tasks.find(task => task.id === parseInt(ctx.params.id));
  const indexTaskFull = tasksFull.find(task => task.id === parseInt(ctx.params.id));
  if (indexTask === -1 && indexTaskFull === -1) {
    ctx.throw(404, 'Task not found');
  } else {
    tasks.splice(indexTask, 1);
    tasksFull.splice(indexTaskFull, 1);
    ctx.status = 204; // No Content
  }
});

app.use(BodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
