const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

socket.connect('http://localhost:3000/');


const tasks = [];

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/client/public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });

app.use((req, res) => {
    res.status(404).send({message: 'Not found...'});
  })
const io = socket(server);


io.on('connection', (socket) => {
  console.log('I am communicating!!!')
  socket.emit('updateDate', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('updateTasks', tasks)
  });
  socket.on('removeTask', (index) => {
    tasks.splice(index, 1);
    socket.broadcast.emit('updateTask', tasks);
  })
})
