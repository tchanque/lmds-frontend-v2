import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";
import EventCard from "../event_card/EventCard";
import PopUpEvent from "../pop_up_event/PopUpEvent";



const UserAgenda = ({ userId }) => {
  const [token] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [attendance, setAttendance] = useState([]);
  


  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        // Fetch all attendances
        const attendancesResponse = await axiosPrivate.get(`/attendances`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("All Attendances:", attendancesResponse.data);
 

        const userAttendances = attendancesResponse.data.filter((attendance) => { 
          return attendance.attendee_id && parseInt(attendance.attendee_id, 10) == userId;
        });

        const eventPromises = userAttendances.map((attendance) =>
          axiosPrivate.get(`/events/${attendance.event_id}`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        );

        const eventsResponses = await Promise.all(eventPromises);
        const eventsData = eventsResponses.map((response) => response.data);

        console.log("Events Data:", eventsData);

        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user events:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserEvents();
    }
  }, [userId, token]);

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

  // Set user attendance for a specific event
  const setUserAttendance = async () => {
    if (selectedEvent) {
      try {
        const response = await axiosPrivate.get(`/events/${selectedEvent.id}`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
  
        const updatedEvent = response.data;
        setSelectedEvent(updatedEvent);
        const attendances = updatedEvent.event_instruments.reduce((acc, eventInstrument) => {
          const userAttendances = eventInstrument.attendances.filter(att => currentUser.id === att.attendee.id);
          return [...acc, ...userAttendances];
        }, []);
        if(attendances.length > 0) {
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


// Open popup and set selected event
const openPopUp = async (event) => {
  setUserAttendance(event);  // Pass the event directly
  setSelectedEvent(event);
  setShowPopup(true);
  console.log(event)
};

// Close popup and reset selected event
const closePopUp = async () => {
  setShowPopup(false);
  setSelectedEvent(null);
  window.location.reload();
};

// Use effect to set user attendance when popup is shown
useEffect(() => {
  if (selectedEvent) {
    setUserAttendance(selectedEvent);
  }
}, [showPopup]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
<div>
      <h1>My Events</h1>
      <div>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            formatDate={formatDate}
            openPopUp={openPopUp}
          />
        ))}
      </div>
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
  );
};

export default UserAgenda;