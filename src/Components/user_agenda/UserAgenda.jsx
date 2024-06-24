import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";
import { Button } from "@nextui-org/react";

const UserAgenda = ({ userId }) => {
  const [token] = useAtom(bearerTokenAtom);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log("User ID:", userId, typeof userId);

        const userAttendances = attendancesResponse.data.filter((attendance) => { 
          console.log("Attendance Attendee ID:", attendance.attendee_id);
          return attendance.attendee_id && parseInt(attendance.attendee_id, 10) == userId;
        });

        console.log("Filtered Attendances for user:", userAttendances);

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
            <div
              key={event.id}>
            

           

             
                <div>
                  <h3 className="underline">{event.category}</h3>
                  <p>le {event.start_date}</p>
                  <h4>{event.title}</h4>
                </div>
                <p className="underline">Description</p>
                <p>{event.description}</p>
              </div>
            
          ))}
      
        </div>
    </div>
  );
};

export default UserAgenda;