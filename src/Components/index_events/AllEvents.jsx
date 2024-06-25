import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Card, Skeleton } from "@nextui-org/react";
import PopUpEvent from "../pop_up_event/PopUpEvent";
import { axiosPrivate } from "../../api/axios";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import EventCard from "../event_card/EventCard";

const AllEvents = () => {
  // Atom states for token and current user
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  
  // Component states
  const [allEvents, setAllEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [attendance, setAttendance] = useState([]);

  // Format date to French locale
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

  // Fetch all events on token change
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

  // Set user attendance for a specific event
  const setUserAttendance = async () => {
    if (selectedEvent) {
      try {
        const response = await axiosPrivate.get(`/events/${selectedEvent.id}`, {
          headers: {
            Authorization: `${token}`,
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
  };

  // Use effect to set user attendance when popup is shown
  useEffect(() => {
    if (selectedEvent) {
      setUserAttendance(selectedEvent);
    }
  }, [showPopup]); 

  
  return (
<>
      <h1>ALL EVENTS HERE</h1>
      <div className="flex">
        <div>
          <Card className="w-[550px] h-[500px] space-y-10 p-4 m-10" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="w-3/5 h-3 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="w-4/5 h-3 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="w-2/5 h-3 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        </div>
        <div className="flex flex-col">
          {allEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              formatDate={formatDate}
              openPopUp={openPopUp}
            />
          ))}
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

    // <>
    //   <h1>ALL EVENTS HERE</h1>
    //   <div className="flex">
    //     <div>
    //       <Card className="w-[550px] h-[500px] space-y-10 p-4 m-10" radius="lg">
    //         <Skeleton className="rounded-lg">
    //           <div className="h-24 rounded-lg bg-default-300"></div>
    //         </Skeleton>
    //         <div className="space-y-3">
    //           <Skeleton className="w-3/5 rounded-lg">
    //             <div className="w-3/5 h-3 rounded-lg bg-default-200"></div>
    //           </Skeleton>
    //           <Skeleton className="w-4/5 rounded-lg">
    //             <div className="w-4/5 h-3 rounded-lg bg-default-200"></div>
    //           </Skeleton>
    //           <Skeleton className="w-2/5 rounded-lg">
    //             <div className="w-2/5 h-3 rounded-lg bg-default-300"></div>
    //           </Skeleton>
    //         </div>
    //       </Card>
    //     </div>
    //     <div className="flex flex-col">
    //       {allEvents.map((event) => (
    //         <div
    //           key={event.id}
    //           className="flex items-center self-center justify-around w-4/6 gap-5 p-5 m-5 bg-white shadow h-72"
    //         >
    //           <div className="w-80">
    //             <img
    //               className=""
    //               src="https://media.istockphoto.com/id/1667873018/fr/photo/gar%C3%A7on-jouant-de-la-batterie-dans-une-%C3%A9cole-de-musique.jpg?s=2048x2048&w=is&k=20&c=Bn0w595KUKm2zDPhSDREM4o9nd5wSc94vpd4ADxruRo="
    //             />
    //           </div>

    //           <p className="flex self-start text-sm">
    //             {formatDate(event.start_date)}
    //           </p>

    //           <div className="flex flex-col items-center gap-0">
    //             <div className="flex flex-col items-center gap-0">
    //               <h3 className="underline">{event.category}</h3>
    //               <p className="">{event.title}</p>
    //             </div>
    //             <h3 className="underline">Description</h3>
    //             <p>{event.description}</p>
    //             <div className="flex gap-10">
    //               <Button className="text-white bg-info-main" onClick={() => openPopUp(event)}>Voir Plus</Button>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //       {showPopup && selectedEvent && (
    //         <PopUpEvent
    //           selectedEvent={selectedEvent}
    //           isVisible={showPopup}
    //           closePoPup={closePopUp}
    //           isAttendee={isAttendee}
    //           setUserAttendance={setUserAttendance}
    //           attendance={attendance}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </>
  );
};

export default AllEvents;
