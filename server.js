const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('koa2-cors');
const { v4: uuidv4 } = require('uuid');
const formatDate = require('./formatDate');
const Ticket = require('./Ticket');
const TicketFull = require('./TicketFull');
// import formatDate from './formatDate.js';
// import Ticket from './Ticket.js';
// import TicketFull from './TicketFull.js';

const app = new Koa();
const router = new Router();

let tickets = [];
let ticketsFull = [];

app.use(cors());

// создание нового тикета (принимает formData, id = null)
router.post('/createTicket', async (ctx, next) => {
  const { id, name, description, status } = ctx.request.body;
  const uniqueId = uuidv4();
  const date = formatDate(Date.now());
  if (tickets.some(ticket => ticket.id !== id)) {
    const ticket = new Ticket(uniqueId, name, status, date);
    const ticketFull = new TicketFull(uniqueId, name, description, status, date);
    tickets.push(ticket);
    ticketsFull.push(ticketFull);
    ctx.status = 201; // Created
    ctx.body = { ticket };
    return;
  }
  
  ctx.throw(304, 'Already have a ticket with that name');
});

// получение всех тикетов (массив объектов Ticket)
router.get('/allTickets', async (ctx, next) => {
  ctx.body = { tickets };
});

// получение тикета по id (объект TicketFull)
router.get('/tickets/:id', async (ctx, next) => {
  const ticket = tickets.find(ticket => ticket.id === parseInt(ctx.params.id));
  ticket
    ? ctx.body = { ticket }
    : ctx.throw(404, 'Ticket not found');
});

// обновление тикета по id
router.put('/tickets/:id', async (ctx, next) => {
  const ticket = tickets.find(ticket => ticket.id === parseInt(ctx.params.id));
  if (!ticket) {
    ctx.throw(404, 'Ticket not found');
  } else {
    const { name, description, status } = ctx.request.body;
    ticket.name = name || ticket.name;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ctx.status = 200;
    ctx.body = { ticket };
  }
});

// удаление тикета по id
router.delete('/tickets/:id', async (ctx, next) => {
  const index = tickets.findIndex(ticket => ticket.id === parseInt(ctx.params.id));
  if (index === -1) {
    ctx.throw(404, 'Ticket not found');
  } else {
    tickets.splice(index, 1);
    ctx.status = 204; // No Content
  }
});

app.use(BodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
