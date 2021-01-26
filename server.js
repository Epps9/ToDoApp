const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');


let tasks = [];

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
  });

  
const io = socket(server);


io.on('connection', (socket) => {
  console.log('socket' + ' ' + socket.id + ' ' + 'has arrived')
  socket.emit('updateTasks', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('Im adding the task');
  });
  socket.on('removeTask', (id) => {
    console.log('Im removing the task' + id)
    tasks = tasks.filter((task) => task.id !== id)
    socket.broadcast.emit('removeTaskServer', tasks);
  });
  socket.on('disconnect', (user) => { console.log('Oh, socket ' + socket.id + ' has left')
  });
})
