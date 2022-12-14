import { useState, useRef, useEffect, useReducer } from 'react';
import useLocalStorage from 'use-local-storage';

import Task from './Task';
import './TaskManager.css';
import Alert from '../alert/Alert';
import Confirm from '../confirm/Confirm';
import taskReducer from './taskReducer';

const TaskManagerReducer = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const [tasks, setTasks] = useLocalStorage('tasks', []);

  const initialState = {
    tasks,
    taskID: null,
    isEditing: false,
    isAlertOpen: false,
    alertContent: 'This is an alert',
    alertClass: 'danger',
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    modalTitle: 'Delete Task',
    modalMsg: ' You are about to delete this task',
    modalActionText: 'OK',
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  const closeAlert = () => {
    dispatch({
      type: 'CLOSE_ALERT',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) {
      dispatch({
        type: 'EMPTY_FIELD',
      });
    }

    if (name && date && state.isEditing) {
      const updatedTask = {
        id: state.taskID,
        name,
        date,
        complete: false,
      };
      dispatch({
        type: 'UPDATE_TASK',
        payload: updatedTask,
      });
      setName('');
      setDate('');
      // saving to local storage
      setTasks(
        tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return { ...task, name, date, complete: false };
          }
          return task;
        })
      );
      return;
    }
    if (name && date) {
      console.log('ADD_TASK...');
      console.log(state);
      const newTask = {
        id: Date.now(),
        name,
        date,
        complete: false,
      };
      dispatch({
        type: 'ADD_TASK',
        payload: newTask,
      });
      setName('');
      setDate('');
      // saving to local storage
      setTasks([...tasks, newTask]);
    }
  };

  const openEditModal = (id) => {
    dispatch({
      type: 'OPEN_EDIT_MODAL',
      payload: id,
    });
  };

  const handleEditTask = () => {
    const id = state.taskID;
    dispatch({
      type: 'EDIT_TASK',
      payload: id,
    });
    const thisTask = state.tasks.find((task) => task.id === id);
    setName(thisTask.name);
    setDate(thisTask.date);
    closeModal();
  };

  const openDeleteModal = (id) => {
    dispatch({
      type: 'OPEN_DELETE_MODAL',
      payload: id,
    });
  };

  const handleDeleteTask = () => {
    const id = state.taskID;
    dispatch({
      type: 'DELETE_TASK',
      payload: id,
    });
    //saving to local storage
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);

    closeModal();
  };

  const handleCompleteTask = (id) => {
    dispatch({
      type: 'COMPLETE_TASK',
      payload: id,
    });

    //saving to local storage
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: true };
        }
        return task;
      })
    );
  };

  const closeModal = () => {
    dispatch({
      type: 'CLOSE_MODAL',
    });
  };

  return (
    <div className='--bg-primary '>
      {state.isAlertOpen && (
        <Alert
          alertClass={state.alertClass}
          alertContent={state.alertContent}
          onCloseAlert={closeAlert}
        />
      )}

      {state.isEditModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalActionText={state.modalActionText}
          modalAction={handleEditTask}
          onCloseModal={closeModal}
        />
      )}

      {state.isDeleteModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalActionText={state.modalActionText}
          modalAction={handleDeleteTask}
          onCloseModal={closeModal}
        />
      )}

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
              {state.isEditing ? 'Edit Task' : 'Save Task'}
            </button>
          </form>{' '}
        </div>
      </div>
      {/* Display task */}
      <article className='--flex-center --my2'>
        <div className='--width-500px --p'>
          <h2 className='--text-light --text-center'>Task List</h2>
          <hr style={{ background: '#fff' }} />
          {state.tasks.length === 0 ? (
            <p className='--text-light'>No tasks added</p>
          ) : (
            <div>
              {state.tasks.map((task) => {
                const { name, date, id, complete } = task;
                return (
                  <Task
                    key={id}
                    {...task}
                    editTask={openEditModal}
                    deleteTask={openDeleteModal}
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
