import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./calendar_event.css";

const CalendarEvent = ({ allEvents, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    // Several checks before setting the new selected date
    if (!selectedDate) {
      // First checking if selectedDate was initially null
      // In that case we just set selectedDate as date
      setSelectedDate(date);
    } else if (date.toDateString() === selectedDate.toDateString()) {
      // if both dates actually match, this means the user has clicked on the same date
      // then we should set selectedDate as null so it turns off the date filter on the parent component (same behavior as when we land on the page)
      setSelectedDate(null);
    } else {
      // Otherwise just set a the selected date as the date
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate]);

  // Fonction pour déterminer la classe CSS des jours avec événements
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = allEvents.filter(
        (event) => new Date(event.start_date).toDateString() === date.toDateString()
      );
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        return "selected";
      } else if (dayEvents.length > 0) {
        return "highlight";
      }
    }
    return null;
  };

  return (
    <div className="container_calendar">
      <Calendar
        onChange={handleDateChange}
        tileClassName={tileClassName}
         // Applique la classe CSS aux jours avec événements
      />
    </div>
  );
};

export default CalendarEvent;
