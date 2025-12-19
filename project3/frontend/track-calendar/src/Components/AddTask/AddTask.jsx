import React from 'react'
import './AddTask.css';

const AddTask = ({
    taskPopup,
    taskText,
    handleTaskSubmit,
    editTask,
    setTaskPopup,
    setTaskText,
}) => {
    if (!taskPopup) return null;
    return (

    <div className="tasks">
    {taskPopup && (
      <div className="task-popup">
        <textarea placeholder='Enter Your Task (minimunm 100 character)'
          value={taskText}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setTaskText(e.target.value)
            }
          }}></textarea>
        <button className="task-popup-btn" onClick={handleTaskSubmit}>
          {editTask ? 'Update Event' : 'Add Event'}
        </button>
        <button className="close-task-popup"
          onClick={() => setTaskPopup(false)}>
          <i className="bx bx-x"></i>
        </button>
      </div>
      )}
    </div>
  )
}

export default AddTask
