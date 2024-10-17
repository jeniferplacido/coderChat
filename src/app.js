const express = require('express');

const {engine} = require('express-handlebars');

const path = require('path');

const socketIO = require('socket.io');

const http = require('http');

const viewsRouter = require('./routes/view.router.js');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const server = http.createServer(app);	

const io = socketIO(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
const staticPath = path.join(__dirname, 'public');
app.use('/public', express.static(staticPath));

app.use('/', viewsRouter);

let messages = [];

io.on('connection', socket => {
    console.log('Um novo cliente se conectou!');

    socket.on('authenticate', (user)=>{
        console.log('Usuario conectado: ', user)

        socket.emit('messageLogs', messages)
    });

    socket.on('message', (data) => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });

});

server.listen(8080, () => {
    console.log('Servidor rodando na porta 8080!')
});