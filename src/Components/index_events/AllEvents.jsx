import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import PopUpEvent from "../pop_up_event/PopUpEvent";
import { axiosPrivate } from "../../api/axios";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import EventCard from "../event_card/EventCard";
import CalendarEvent from "../calendar_event/CalendarEvent";

const AllEvents = () => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [allEvents, setAllEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("fr-FR", options);
  };

  // Fetch all the events, when loading the page
  useEffect(() => {
    if (token) {
      axiosPrivate
        .get("/events", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          setAllEvents([...response.data]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  // Set the filtered events by default as all the events (when no dates are selected yet)
  useEffect(() => {
    setFilteredEvents(allEvents);
  }, [allEvents]);

  const handleDateChange = (date) => {
    !date
      ? setFilteredEvents(allEvents)
      : setFilteredEvents(
          allEvents.filter(
            (event) =>
              new Date(event.start_date).toDateString() === date.toDateString()
          )
        );
  };

  const setUserAttendance = async (event) => {
    if (event) {
      try {
        const response = await axiosPrivate.get(`/events/${event.id}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const updatedEvent = response.data;
        setSelectedEvent(updatedEvent);
        const attendances = updatedEvent.event_instruments.reduce(
          (acc, eventInstrument) => {
            const userAttendances = eventInstrument.attendances.filter(
              (att) => currentUser.id === att.attendee.id
            );
            return [...acc, ...userAttendances];
          },
          []
        );
        if (attendances.length > 0) {
          setIsAttendee(true);
          setAttendance(attendances);
        } else {
          setIsAttendee(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openPopUp = async (event) => {
    setUserAttendance(event);
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const closePopUp = async () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (selectedEvent) {
      setUserAttendance(selectedEvent);
    }
  }, [showPopup]);

  return (
    <>
      <div className="grid grid-cols-1 justify-items-center lg:grid-cols-5">
        <div className="lg:col-span-2 lg:w-3/4">
          <CalendarEvent
            allEvents={allEvents}
            onDateChange={handleDateChange}
          />
        </div>
        <div className="lg:col-span-3 w-full flex flex-col">
          {filteredEvents.length === 0 ? (
            <h2>PAS D'EVENT</h2>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                formatDate={formatDate}
                openPopUp={openPopUp}
              />
            ))
          )}
          {showPopup && selectedEvent && (
            <PopUpEvent
              selectedEvent={selectedEvent}
              isVisible={showPopup}
              closePoPup={closePopUp}
              isAttendee={isAttendee}
              setUserAttendance={setUserAttendance}
              attendance={attendance}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllEvents;
