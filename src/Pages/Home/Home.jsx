import "./home.css";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom, popUpAtom } from "../../atom/atoms";
import EventForm from '../../Components/event_form/EventForm';
import AllEvents from '../../Components/show_events/AllEvents';
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const [popUp, setPopUp] = useAtom(popUpAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [token, setToken] = useAtom(bearerTokenAtom)
  const [loading, setLoading] = useState(true)
  

  const handlePopUp = () => {
    setPopUp(true);
  };

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
    if (!token) {
      setLoading(false)
    }
  }, [currentUser])

  if (loading)
    return (
      <p>Ca charge (du bourg palette)</p>
    )

 
  return (
    <>
      <div className="content">
        <h1>Home</h1>
        <div className="flex justify-center gap-4 my-20">
          <h2 className="text-xl font-bold leading-tight tracking-tight font-Ubuntu text-primary-dark md:text-2xl dark:text-white">
            Événements
          </h2>
          
          {currentUser && ( !popUp && (currentUser.role === "Admin" || currentUser.role === "Professeur") && (
            <button onClick={handlePopUp} className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#17A964"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#FFFF"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            )
          )}
        </div>
        {popUp && <EventForm />}
      </div>
      <div>
        <AllEvents />
      </div>
    </>
  );
};

export default Home;
