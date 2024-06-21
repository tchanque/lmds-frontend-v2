import { axiosPrivate } from "../../api/axios";
import { useState, useEffect } from "react";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useAtom } from "jotai";
import { Card, Skeleton } from "@nextui-org/react";
import {Button} from "@nextui-org/react";

const AllEvents = () => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [allEvents, setAllEvents] = useState([]);

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

  useEffect(() => {
    if (token) {
      console.log("This is your Token", token);
    }
    if (currentUser) {
      console.log("This is your Current User", currentUser);
    }
  }, [token]);

  //FETCH ALL THE EVENTS
  useEffect(() => {
  
      axiosPrivate
        .get("/events", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          setAllEvents([...response.data]);
          console.log("this is ALL the events :", allEvents);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [token]);

  console.log("this is ALL the events :", allEvents);
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
            <div
              key={event.id}
              className="flex items-center self-center justify-around w-4/6 gap-5 p-5 m-5 bg-white shadow h-72"
            >
              <div className="w-80">
                <img
                  className=""
                  src="https://media.istockphoto.com/id/1667873018/fr/photo/gar%C3%A7on-jouant-de-la-batterie-dans-une-%C3%A9cole-de-musique.jpg?s=2048x2048&w=is&k=20&c=Bn0w595KUKm2zDPhSDREM4o9nd5wSc94vpd4ADxruRo="
                />
              </div>

              <p className="flex self-start text-sm">
                {formatDate(event.start_date)}
              </p>

              <div className="flex flex-col items-center gap-0">
                <div className="flex flex-col items-center gap-0">
                  <h3 className="underline">{event.category}</h3>
                  <p className="">{event.title}</p>
                </div>
                <h3 className="underline">Description</h3>
                <p>{event.description}</p>
                <div className="flex gap-10">
                  <Button className="text-white bg-success-main">INSCRIPTION</Button>
                  <Button className="text-white bg-danger-main">DÉSCRIPTION</Button>
                </div>
              </div>
              {event.event_instruments.length > 0 && (
                <div className="flex flex-col">
                  {event.event_instruments.map((event_instrument) => (
                    <p className="text-sm" key={event_instrument.id}>
                      {event_instrument.instrument.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllEvents;
