const taskReducer = (state, action) => {
  switch (action.type) {
    case 'EMPTY_FIELD':
      return {
        ...state,
        isAlertOpen: true,
        alertContent: 'Please enter name and date',
        alertClass: 'danger',
      };
    case 'CLOSE_ALERT':
      return {
        ...state,
        isAlertOpen: false,
      };
    case 'ADD_TASK':
      const allTasks = [...state.tasks, action.payload];

      return {
        ...state,
        tasks: allTasks,
        isAlertOpen: true,
        alertContent: 'Task added successfuly',
        alertClass: 'success',
      };

    case 'OPEN_EDIT_MODAL':
      return {
        ...state,
        isEditModalOpen: true,

        taskID: action.payload,
        modalTitle: 'Edit Task',
        modalMsg: 'You are about to edit this task',
        modalActionText: 'EDIT',
      };

    case 'OPEN_DELETE_MODAL':
      return {
        ...state,
        isDeleteModalOpen: true,

        taskID: action.payload,
        modalTitle: 'Delete Task',
        modalMsg: 'You are about to delete this task',
        modalActionText: 'DELETE',
      };

    case 'EDIT_TASK':
      return {
        ...state,
        isEditing: true,
      };

    case 'DELETE_TASK': {
      const id = action.payload;
      const newTasks = state.tasks.filter((task) => task.id !== id);
      return {
        ...state,
        tasks: newTasks,
        isAlertOpen: true,
        alertContent: 'Task deleted successfully',
        alertClass: 'success',
      };
    }

    case 'CLOSE_MODAL':
      return {
        ...state,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
      };

    case 'UPDATE_TASK':
      const updatedTask = action.payload;
      const id = action.payload.id;

      // find the task index
      const taskIndex = state.tasks.findIndex((task) => {
        return task.id === id;
      });

      // replace the task by its index
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }
      return {
        ...state,
        isEditing: false,
        isAlertOpen: true,
        alertContent: 'Task edited successfully',
        alertClass: 'success',
      };

    case 'COMPLETE_TASK': {
      const id = action.payload;

      // find the task index
      const taskIndex = state.tasks.findIndex((task) => {
        return task.id === id;
      });

      let updatedTask = {
        id,
        name: state.tasks[taskIndex].name,
        date: state.tasks[taskIndex].date,
        complete: true,
      };
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }
      return {
        ...state,
        isAlertOpen: true,
        alertContent: 'Task completed',
        alertClass: 'success',
      };
    }

    default:
      return state;
  }
  return state;
};

export default taskReducer;
