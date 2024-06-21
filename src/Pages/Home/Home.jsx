import { useState } from "react";
import EventForm from "../../Components/event_form/EventForm";
import "./Home.css";
import { useAtom } from "jotai";
import { popUpAtom } from "../../atom/atoms";


const Home = () => {
  const [popUp, setPopUp] = useAtom(popUpAtom);
  

  const handlePopUp = () => {
    setPopUp(true);
  };

  return (
    <>
      <div className="content">
        <h1>Home</h1>
        <div className="flex justify-center gap-4 my-20">
          <h2 className="text-xl font-bold leading-tight tracking-tight font-Ubuntu text-primary-dark md:text-2xl dark:text-white">
            Événements
          </h2>
          {popUp == true ? (
            <></>
          ) : (
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
          )}
        </div>
        {popUp && <EventForm />}
      </div>
    </>
  );
};

export default Home;
