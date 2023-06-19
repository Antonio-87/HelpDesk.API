const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');
const { v4: uuidv4 } = require('uuid');
const formatDate = require('./formatDate');
const Task = require('./Task');
const TaskFull = require('./TaskFull');

const app = new Koa();
const router = new Router();

let tasks = [];
let tasksFull = [];

app.use(BodyParser());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

// создание новой задачи (принимает formData)
router.post('/createTask', async (ctx, next) => {
  const { name, description, status } = ctx.request.body;
  const uniqueId = uuidv4();
  const date = formatDate(Date.now());
  if (!tasks.some(task => task.id === uniqueId)) {
    const task = new Task(uniqueId, name, status, date);
    const taskFull = new TaskFull(uniqueId, name, description, status, date);
    tasks.push(task);
    tasksFull.push(taskFull);
    ctx.status = 201;
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
  const taskFull = tasksFull.find(task => task.id === ctx.params.id);
  taskFull
    ? ctx.body = { taskFull }
    : ctx.throw(404, 'Task not found');
});

// обновление задачи по id
router.put('/tasks/:id', async (ctx, next) => {
  const { name, description, status } = ctx.request.body;
  const task = tasks.find(task => task.id === ctx.params.id);
  const taskFull = tasksFull.find(task => task.id === ctx.params.id);
  if (!task && !taskFull) {
    ctx.throw(404, 'Task not found');
  }
  task.name = name ? name : task.name;
  taskFull.name = task.name;
  taskFull.description = description ? description : taskFull.description;
  task.status = status !== null ? status : task.status;
  taskFull.status = task.status;
  ctx.status = 200;
});

// удаление задачи по id
router.delete('/tasks/:id', async (ctx, next) => {
  const indexTask = tasks.find(task => task.id === ctx.params.id);
  const indexTaskFull = tasksFull.find(task => task.id === ctx.params.id);
  if (indexTask === -1 && indexTaskFull === -1) {
    ctx.throw(404, 'Task not found');
  } else {
    tasks.splice(indexTask, 1);
    tasksFull.splice(indexTaskFull, 1);
    ctx.status = 204; // No Content
  }
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
