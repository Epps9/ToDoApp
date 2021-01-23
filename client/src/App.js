import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


class App extends React.Component {
  state = {
    tasks: [{id: 0, name: 'Do something'}],
    taskData: {
      id: '',
      name: ''
    },
  }

  componentDidMount = () => {
    this.socket = io.connect('localhost:8000');
    this.socket.on('updateTasks', (tasks) => this.updateTasks(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTaskServer', (tasks) => this.updateTasks(tasks));
  }  

  updateTasks(tasks){
    this.setState({
      ...this.state,
      tasks: tasks,
    });
  };

  removeTask (id) {
    this.setState({
      ...this.state,
      tasks: this.state.tasks.filter(task => task.is === id)
    });
    this.socket.emit('removeTask', id)
  };


  updateTaskData (event) {
    this.setState({
      ...this.state,
      taskData: {id: uuidv4(), name: event.target.value},
    });
  }

  submitForm (event) {
    event.preventDefault();
    this.addTask(this.state.taskData);
    this.socket.emit('addTask', this.state.taskData);
  }

    addTask(task) {
      this.setState(state =>({
        ...state,
        tasks: [...state.tasks, {id: task.id, name: task.name}]
      }));
    }
  

  render() {

    return (
      <div className="App">

    <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {this.state.tasks.map( (task)  => (
          <li key={task.id} className="task"> {task.name} <button className="btn btn--red" onClick={()=> this.removeTask(task.id)} >Remove</button></li>
        ) )}
      </ul>

      <form id="add-task-form">
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name"  onChange={(event) => this.updateTaskData(event)} />
        <button className="btn" type="submit" onClick={(event) => this.submitForm(event)}>Add</button>
      </form>
    </section>
  </div>
    );
  };

};

export default App;