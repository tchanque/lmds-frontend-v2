// CalendarEvent.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarEvent = ({ allEvents, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  // Fonction pour déterminer la classe CSS des jours avec événements
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = allEvents.filter(
        (event) => new Date(event.start_date).toDateString() === date.toDateString()
      );
      if (dayEvents.length > 0) {
        return 'highlight';
      }
    }
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'selected';
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        tileClassName={tileClassName} // Applique la classe CSS aux jours avec événements
      />
    </div>
  );
};

export default CalendarEvent;