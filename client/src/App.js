import React from 'react';
import io from 'socket.io-client';


class App extends React.Component {
  state = {
    tasks: [{id: 0, name: 'Do something'}],
    taskName: '',
  }

  componentDidMount = () => {
    this.socket = io.connect('localhost:8000');
  }  

  removeTask (id) {
    this.setState({
      ...this.state,
      tasks: this.state.tasks.filter(task => task.is === id)
    });
    this.socket.emit('removeTask', id);
  }

  updateTaskName (event) {
    this.setState({
      ...this.state,
      taskName: event.target.value,
    })
  }

  submitForm (event) {
    event.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }

    addTask(task) {
      this.setState(state =>({
        ...state,
        tasks: [...state.tasks, {id: task.id, taskName: task.name}]
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
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} onChange={(event) => this.updateTaskName(event)}/>
        <button className="btn" type="submit" onClick={(event) => this.submitForm(event)}>Add</button>
      </form>
    </section>
  </div>
    );
  };

};

export default App;