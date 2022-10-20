import { useState, useRef, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

import Task from './Task';
import './TaskManager.css';
import Alert from '../alert/Alert';
import Confirm from '../confirm/Confirm';

const TaskManagerReducer = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  //const [tasks, setTasks] = useState([]);
  const [tasks, setTasks] = useLocalStorage('tasks', []);

  const [taskID, setTaskID] = useState(null);
  const [iEditing, setIsEditing] = useState(false);

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) {
      alert('Please enter task name and date');
    } else if (name && date && iEditing) {
      setTasks(
        tasks.map((task) => {
          if (task.id === taskID) {
            return {
              ...task,
              name,
              date,
              complete: false,
            };
          }
          return task;
        })
      );
      setName('');
      setDate('');
      setIsEditing(false);
      setTaskID(null);
    } else {
      const newTask = {
        id: Date.now(),
        name,
        date,
        complete: false,
      };
      setTasks([...tasks, newTask]);
      setName('');
      setDate('');
    }
  };

  const handleEditTask = (id) => {
    const thisTask = tasks.find((task) => task.id === id);

    setIsEditing(true);
    setTaskID(id);
    setName(thisTask.name);
    setDate(thisTask.date);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete ?') === true) {
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
    }
  };

  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: true };
        }
        return task;
      })
    );
  };

  return (
    <div className='--bg-primary '>
      {/* <Alert /> */}
      <Confirm />
      <h1 className='--text-center --text-light'>Task Manager Reducer</h1>
      <div className='--flex-center --p'>
        <div className='--card --bg-light --width-500px --p --flex-center'>
          <form onSubmit={handleSubmit} className='form --form-control'>
            <div>
              <label htmlFor='name'>Task:</label>
              <input
                ref={nameInputRef}
                type='text'
                placeholder='Task name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='date'>Date:</label>
              <input
                type='date'
                placeholder='Task name'
                name='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button className='--btn --btn-success --btn-block'>
              {iEditing ? 'Edit Task' : 'Save Task'}
            </button>
          </form>{' '}
        </div>
      </div>
      {/* Display task */}
      <article className='--flex-center --my2'>
        <div className='--width-500px --p'>
          <h2 className='--text-light --text-center'>Task List</h2>
          <hr style={{ background: '#fff' }} />
          {tasks.length === 0 ? (
            <p className='--text-light'>No tasks added</p>
          ) : (
            <div>
              {tasks.map((task) => {
                const { name, date, id, complete } = task;
                return (
                  <Task
                    key={id}
                    {...task}
                    editTask={handleEditTask}
                    deleteTask={handleDeleteTask}
                    completeTask={handleCompleteTask}
                  />
                );
              })}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default TaskManagerReducer;
