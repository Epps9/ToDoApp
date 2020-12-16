const express = require('express');
const app = express();
const socket = require('socket.io');


const tasks = [];


const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });

const io = socket(server);


app.use((req, res) => {
    res.status(404).send({message: 'Not found...'});
  })
  
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
