/* eslint-disable react/prop-types */
import "./popup_publication.css";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom, bearerTokenAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";

const PopUpPublication = ({ selectedPublication, closePoPup}) => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  
  // Ensuring token and current user are set
  useEffect(() => {
    if (!token) {
      setToken(bearerTokenAtom);
    }
    if (!currentUser) {
      setCurrentUser(currentUserAtom);
    }
  }, [token, currentUser]);

  if (!selectedPublication) {
    return null;
  }






  return (
    <>
      <div className="modal is-active">
        <div className="flex flex-col modal-content">
          <div className="mt-6">
          <img
              className="w-full publication__img"
              src="https://cdn.pixabay.com/photo/2024/05/18/08/16/cat-8769861_1280.jpg"
              alt={selectedPublication.title}
            /></div>
          <div className="flex flex-col items-center gap-8 p-2">
            <div className="text-center">
              <h2 className="">{selectedPublication.title}</h2>
         
            </div>
         
            <div className="text-center">
              <p>{selectedPublication.description}</p>
            </div>
          </div>
          <button className="modal-close" onClick={closePoPup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25"
              height="25"
              viewBox="0 0 50 50"
              fill="#F31248"
            >
              <path
                d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                stroke="#F31248"
                strokeWidth={1.5}
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default PopUpPublication
