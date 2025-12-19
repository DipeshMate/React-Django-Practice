import React, { useState, useEffect } from 'react'
import './Calendar.css'
import { FaFire } from "react-icons/fa"; // Flame icon (from react-icons library)

import axios from 'axios'
import Tasklist from '../Tasklist/Tasklist';
import AddTask from '../AddTask/AddTask';

const Calendar = () => {
  const daysOfWeeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  const [task, setTask] = useState([]);
  const [errors, setErrors] = useState("");
  

  const [streakCount, setStreakCount] = useState(0);
  const [lastClickedDate, setLastClickedDate] = useState(null);
  const [streakData, setStreakData] = useState({});

  /*------------------------task PopUp-------------------------*/

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [taskPopup, setTaskPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };


  /*-------edit task--------*/
  const [taskText, setTaskText] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [taskdate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);


  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const prevbtn = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
  }
  const nextbtn = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
  }

  /*------------------------Function for handle date for previous tasks in calendar-------------------------*/

  const handleClickedDay = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    const today = new Date()

    if (clickedDate >= today || isSameDay(today, clickedDate)) {
      setSelectedDate(clickedDate)
      setTaskPopup(true)
      setTaskText("")
      setEditTask(null)
    }

  }
  const isSameDay = (date1, date2) =>
    date1.toDateString() === date2.toDateString();

  // const handleCompletedTask = (taskId, dayNumber) => {
  //   const key = `${currentMonth}-${currentYear}`;
  //   const updatedStatus = !(streakData[key]?.[dayNumber] || false);
  //   console.log("taskId:",taskId);
  //   // Optimistic UI update
  //   setStreakData((prev) => ({
  //     ...prev,
  //     [key]: {
  //       ...(prev[key] || {}),
  //       [dayNumber]: updatedStatus,
  //     },
  //   }));

  //   // API call to update streak in the backend
  //   axios
  //     .patch(`http://127.0.0.1:8000/track/${taskId}`, { completed: updatedStatus })
  //     .then((response) => {
  //       // Update streak in the local task list
  //       const updatedTask = response.data;
  //       setTask((prev) =>
  //         prev.map((task) =>
  //           task.id === taskId ? { ...task, ...updatedTask } : task
  //         )
  //       );
  //     })
  //     .catch((err) => {
  //       console.error("Error updating task completion:", err);

  //       // Revert the optimistic UI update if the API call fails
  //       setStreakData((prev) => ({
  //         ...prev,
  //         [key]: {
  //           ...(prev[key] || {}),
  //           [dayNumber]: !updatedStatus,
  //         },
  //       }));
  //     });
  // };

  const handleCompletedTask = (dayNumber) => {
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);

    let isConsecutive = false;

    if (lastClickedDate) {
      const timeDiff = clickedDate - lastClickedDate;
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert time difference to days
      isConsecutive = dayDiff === 1;

      if (isConsecutive) {
        // Consecutive day clicked
        setStreakCount((prev) => prev + 1);
      } else {
        // Break in streak
        setStreakCount(0); 
      }
    } else {
      // First click, initialize streak
      setStreakCount(1);
    }

    // Update the last clicked date
    setLastClickedDate(clickedDate);

    // Optimistic UI update for marking the day
    setStreakData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [dayNumber]: true, // Mark the day as clicked
      },
    }));

    // Optional: API call to save streak data on the server
    axios
      .patch("http://127.0.0.1:8000/track", { streak: streakCount + 1 }) // Assuming streak is updated server-side
      .then((response) => {
        console.log("Streak updated successfully");
      })
      .catch((err) => {
        console.error("Error updating streak:", err);
      });
  };

  /*---------------------function for task submit-------------------------*/
  const handleTaskSubmit = () => {
    // Format date to "YYYY-MM-DD"
    const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : taskdate.toString().split("T")[0];

    // Format time to "HH:mm:ss"
    const formattedTime = `${new Date().getHours().toString().padStart(2, "0")}:${new Date()
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${new Date()
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;


    const newtask = {
      id: editTask ? editTask.id : Date.now(), // Generate a unique ID
      date: formattedDate, // Only the date part
      tasktime: formattedTime, // Time in "HH:mm" format
      task: taskText || "", // Default to empty string if undefined
      completed : false || true,
    };
    //  console.log("Submitting Task:", newtask);

    if (editTask) {
      // Update existing task
      axios
        .patch(`http://127.0.0.1:8000/track/${editTask?.id}`, newtask)
        .then((response) => {
          setTask((prev) =>
            prev.map((task) =>
              task.id === editTask.id ? response.data : task
            )
          );
        })
        .catch((err) => setErrors(err.message));
        setShowPopup(showPopup);
      setTaskDate(newtask.date); // Update the taskdate state
    } else {
      // Add new task
      axios
        .post("http://127.0.0.1:8000/track", newtask)
        .then((response) => {
          setTask((prev) => [...prev, response.data]);
        })
        .catch((err) => setErrors(err.message));
    }
    setSelectedDate(newtask.date); // Reset to today's date
    setTaskText("");
    setTaskPopup(false);
    setEditTask(null);
    setTaskDate(newtask.date);

    console.log("New Task:", newtask);
    console.log("Edit Task:", editTask);
  }


  /*---------------------function for event Edit and Cancel-------------------------*/

  const handleEditTask = (task) => {
    setSelectedDate(new Date(task.date)) // Set the selected date to the task's date
    // If task time exists, split it into hours and minutes; otherwise, set to current time
    setTaskText(task.task); // Set event text, fallback to empty if undefined
    setTaskPopup(true); // Show the event popup
    setEditTask(task); // Set the event being edited
    setTaskDate(task.date); // Update the taskdate state

  }


  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://127.0.0.1:8000/track/${taskId}`)
      .then(() => {
        setTask((prev) => prev.filter((task) => task.id !== taskId));
      })
      .catch((err) => setErrors(err.message));
    setTaskPopup(false)
    setEditTask(null)
  }

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/track')
      .then(response => {
        setTask(response.data)
      }).catch(err => setErrors(err.message)) /*for nettask error*/
  }, [])


  return (
    <div className="container">
    <div className='calendar-app'>

      <div className="calendar">
        {errors && <p>{errors}</p>}

        <h2 className='heading'>Track My Task</h2>
        <div className="navigate-date">
          <div className='buttons'>
            <i className='bx bx-chevron-left' onClick={() => prevbtn()}></i>
          </div>
          <h2 className="month">{monthsOfYear[currentMonth]},</h2>
          <h2 className="year">{currentYear}</h2>
          <div className='buttons'>
            <i className='bx bx-chevron-right' onClick={() => nextbtn()}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeeks.map((days) => <span key={days}>{days}</span>)}
        </div>
        <div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) =>
            (<span key={`empty-${index}`} />))
          }
          {[...Array(daysInMonth).keys()].map((day) => {
            const dayNumber = day + 1;
            const key = `${currentMonth}-${currentYear}`;
            const isCurrentDay =
              dayNumber === currentDate.getDate() &&
              currentMonth === currentDate.getMonth() &&
              currentYear === currentDate.getFullYear();
            
            const isStreakDay = streakData[key]?.[dayNumber];

            return (
              <span
                key={day}
                onClick={() => handleCompletedTask(dayNumber)}
                onDoubleClick={()=>handleClickedDay(dayNumber)}
                className={`day 
                ${isCurrentDay ? 'current-day' : ''} 
                ${streakData[key]?.[dayNumber] ? 'marked' : ''}
                `}
              >
                {dayNumber}
                {isStreakDay && <FaFire className="streak-icon" />}
              </span>
            );
          })}

          </div>
  
          </div>
        

      </div>

      {/* --------------------------------Calendar Ends--------------------------------          */}
     
        <AddTask
          taskPopup={taskPopup}
          setTaskPopup={setTaskPopup}
          taskText={taskText}
          setTaskText={setTaskText}
          handleTaskSubmit={handleTaskSubmit}
          editTask={editTask}
        />
        <Tasklist
         task={task}
         streakCount={streakCount}
         showPopup={showPopup}
         togglePopup={togglePopup}
         handleCompletedTask={handleCompletedTask}
         handleEditTask={handleEditTask}
         handleDeleteTask={handleDeleteTask}
        />

      </div>
    </div>

  )
}

export default Calendar
