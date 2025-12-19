import React from 'react'
import './Tasklist.css'

const Tasklist = ({
  task,
  streakCount,
  showPopup,
  togglePopup,
  handleCompletedTask,
  handleEditTask,
  handleDeleteTask,
}) => {
  return (
    <div className="task-list">
      <div className="streak-count">
        Current Streak: <span>{streakCount}</span>
      </div>
      {/* List of Tasks Button */}
      <button className="dropdown-button" onClick={togglePopup}>
        List of Tasks
      </button>

      {/* Task Popup */}
      {showPopup && (
        <div className="task-dropdown-popup">
          <button className="close-popup"
            onClick={togglePopup}>
            <i className="bx bx-x"></i>
          </button>
          <ul className="task-dropdown-list">
            {task.length ? (
              task.map((task, index) => (
                <div className="task-item" key={index}>
                  <div className="task-date-container">
                    <div className="task-date"> {new Date(task.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}</div>
                    <div className="task-time">{task.tasktime}</div>
                  </div>
                  <div className="task-details">{task.task}</div>
                  <div className="task-buttons">
                    <i
                      className={`bx ${task.completed ? 'bxs-check-circle' : 'bx-check-circle'}`}
                      onClick={() => handleCompletedTask(task.id, task.date)} // Pass task id and date
                    ></i>
                    <i
                      className="bx bxs-edit-alt"
                      onClick={() => handleEditTask(task)}
                    ></i>
                    <i
                      className="bx bx-message-alt-x"
                      onClick={() => handleDeleteTask(task.id)}
                    ></i>
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Tasklist
