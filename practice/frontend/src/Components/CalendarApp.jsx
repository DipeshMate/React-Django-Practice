import React, { useState } from 'react'
import './CalendarApp.css'
const CalendarApp = () => {

    /*------------------------Calender---------------------*/
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const currentDate = new Date()
    
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

    const daysInMonth = new Date(currentYear, currentMonth + 1,0).getDate() /*-- third parameter 0 to get total */
   // console.log(daysInMonth)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    // console.log(currentDate,currentMonth, currentYear );

    /*------------------------Event PopUp-------------------------*/

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);

    /*------------------------Events setup-------------------------*/

    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({ hours: '00', minutes: '00' })

    /*-------edit event--------*/
    const [eventText, setEventText] = useState('');
    const [editEvent, setEditEvent] = useState(null);



    /*------------------------Function for prev and next month-------------------------*/
    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1)) /* otherwise it will go to negative after 0 */
       // setCurrentMonth((a) => a - 1)
        //console.log(currentMonth);
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
       // console.log(currentYear);
        
    }
    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
        setCurrentYear((prevYear)=>(currentMonth === 11 ? prevYear + 1 : prevYear))
    }

    /*------------------------Function for handle date for previous events in calendar-------------------------*/

    const handleClickedDay = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day)
        //console.log(clickedDate);
        const today = new Date()

        if (clickedDate >= today || isSameDay(today, clickedDate)) {
            setSelectedDate(clickedDate)
            setShowEventPopup(true)
            setEventText("")
            setEventTime({ hours: '00', minutes: '00' })
            setEditEvent(null)
        }

    }
    /*---------Check two dates "Current Date === ClickedDay" regardless of time-------------------*/
    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    /*---------------------function for event submit-------------------------*/
    const handleEventSubmit = () => {
        const newEvent = {
            id: editEvent ? editEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
        }

        let updatedEvent = [...events]
        if (editEvent) { 
            updatedEvent = updatedEvent.map((event) =>
                event.id === editEvent.id? newEvent : event
            )
        }
        else {
            updatedEvent.push(newEvent)
        }

        updatedEvent.sort((a,b)=> new Date(a.date) - new Date(b.date))
        
        setEvents(updatedEvent)
        setEventTime({ hours: '00', minutes: '00' })
        setEventText('')
        setShowEventPopup(false)
        setEditEvent(null)
    }
    /*---------------------function Event TIme Change- ------------------------*/
    
    const handleTimeChange = (event) => {
        const [name, value] = event.target

        setEventTime((prevTime)=> ({...prevTime, [name]: value.padStart(2,'0')}))
    } 

    /*---------------------function for event Edit and Cancel-------------------------*/
    
    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date))
        setEventTime({
            hours: event.time.split(':')[0],
            minutes: event.time.split(':')[1]
        })

        setEventText(event.text)
        setShowEventPopup(true)
        setEditEvent(event)
    }

    const handleDeleteEvent = (eventId) => { 
        const updatedEvents = events.filter((event) => event.id!== eventId)
        setEvents(updatedEvents)
        setShowEventPopup(false)
        setEditEvent(null)
    }

    return (
        <div className='calendar-app'>
            {/* --------------------------------Calendar Left Side Start--------------------------------          */}
            <div className="calendar">
                <h2 className="heading">Calendar</h2>
                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[currentMonth]},</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <i className="bx bx-chevron-left" onClick={prevMonth}></i>
                        <i className="bx bx-chevron-right" onClick={nextMonth}></i>
                    </div>
                </div>

                <div className="weekdays">
                    {daysOfWeek.map((days) =>
                        <span key={days}>{days}</span>)}
                </div>

                <div className="days">
                    {/* [...Array()] here aaray is a constructor it create a new array of given length with firstDayOfMonth.
                spread operatpr is used to spread out the elemnts of the array this creates a shallow copy of the array */}
             
                    {[...Array(firstDayOfMonth).keys()].map((_, index) =>
                        (<span key={`empty-${index}`} />))} {/* firstDayOfMonth no of elements all of which are initially undefined and _ is unused parameter*/}
                    
                    {[...Array(daysInMonth).keys()].map((day) => (
                        <span
                            key={day + 1}
                            // className={
                            //     day + 1 === currentDate.getDate() &&
                            //         currentMonth === currentDate.getMonth() &&
                            //         currentYear === currentDate.getFullYear()
                            //         ? 'current-day'
                            //         : ''
                            // }
                            onClick={() => handleClickedDay(day + 1)}
                        >
                            {day + 1}</span>
                    ))}
                </div>
            </div>
            {/* --------------------------------Calendar Ends--------------------------------          */}

            <div className="events">
                {/* --------------------------------events popup--------------------------------          */}
                {showEventPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">Time</div>
                            <input type="number" name='hours' min={0} max={24} className='hours' value={eventTime.hours} onChange={handleTimeChange} />
                            <input type="number" name='minutes' min={0} max={60} className='minutes' value={eventTime.minutes} onChange={handleTimeChange}  />
                        </div>
                        <textarea placeholder='Enter Event Text (minimunm 100 character)'
                            value={eventText}
                            onChange={(e) => {
                                if (e.target.value.length <= 100) {
                                setEventText(e.target.value)
                            }}}></textarea>
                        <button className="event-popup-btn" onClick={handleEventSubmit}>{ editEvent ? 'Update Event' : 'Add Event'}</button>
                        <button className="close-event-popup" onClick={() => setShowEventPopup(false)}>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                )}

                {/* --------------------------------main Events --------------------------------          */}
                {events.map((event, index) => (
                      <div className="event" key={index}>
                      <div className="event-date-container">
                              <div className="event-date">{`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()} ${event.date.getFullYear()}`}</div>
                              <div className="event-time">{event.time}</div>
                      </div>
                          <div className="event-text">{event.text}</div>
                      <div className="event-buttons">
                          <i className="bx bxs-edit-alt" onClick={()=>handleEditEvent(event)}></i>
                          <i className="bx bx-message-alt-x"onClick={()=>handleDeleteEvent(event.id)}></i>
                      </div>
                  </div>
                ))}
              
            </div>
        </div>
    )
}

export default CalendarApp
