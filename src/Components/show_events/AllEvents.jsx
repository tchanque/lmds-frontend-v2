import { axiosPrivate } from "../../api/axios"
import { useState, useEffect } from "react"
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms"
import { useAtom } from "jotai"

const AllEvents = () => {

  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [allEvents, setAllEvents] = useState([])


  useEffect(() => {
    if (token) {
      console.log('This is your Token', token)
    }
    if(currentUser) {
      console.log('This is your Current User', currentUser)
    }
  },[token])


  //FETCH ALL THE EVENTS
  useEffect(() => {
    if(token){
      axiosPrivate.get("/events", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setAllEvents([...response.data])
        console.log("this is ALL the events :", allEvents)
      })
      .catch((error) => {
        console.error(error)
      })
    }}, [token]);


   
  console.log("this is ALL the events :", allEvents)
  return (
    <>
 <h1>ALL EVENTS HERE</h1>
  {allEvents.map((event) => (
    <div key={event.id} className="flex gap-5 p-10 mt-5 bg-white shadow">
      <p>{event.category}</p>
      <p>{event.title}</p>
      <p>{event.start_date}</p>
      <p>{event.end_date}</p>
      <p>{event.price}</p>
      <p>{event.location}</p>
      <p>{event.description}</p>
      {event.event_instruments.length > 0 && (
        <div>
          {event.event_instruments.map((event_instrument) => (
            <p key={event_instrument.id}>{event_instrument.instrument.name}</p>
          ))}
        </div>
      )}
    </div>
  ))}
    </>
  )
}

export default AllEvents