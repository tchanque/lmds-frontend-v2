import { axiosPrivate } from "../../api/axios";
import { useState, useEffect } from "react";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useAtom } from "jotai";
import {Button} from "@nextui-org/react";


function AllPublications() {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [allPublications, setAllPublications] = useState([]);

  useEffect(() => {
    if (token) {
      console.log("This is your Token", token);
    }
    if (currentUser) {
      console.log("This is your Current User", currentUser);
    }
  }, [token]);

  useEffect(() => {
  
    axiosPrivate
      .get("/publications", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setAllPublications([...response.data]);
        console.log("this is ALL the publications :", allPublications);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

console.log("this is ALL the publications :", allPublications);




  return (
    <>
    <h1>ALL PUBLICATIONS HERE</h1>
    <div className="flex">
    
      <div className="flex flex-col">
        {allPublications.map((publication) => (
          <div
            key={publication.id}
            className="flex items-center self-center justify-around w-4/6 gap-5 p-5 m-5 bg-white shadow h-72"
          >
            <div className="w-80">
              <img
                className=""
                src="https://cdn.pixabay.com/photo/2024/05/18/08/16/cat-8769861_1280.jpg"
              />
            </div>

            <div className="flex flex-col items-center gap-0">
              <div className="flex flex-col items-center gap-0">
                <p className="">{publication.title}</p>
              </div>
              <h3 className="underline">Description</h3>
              <p>{publication.description}</p>
              <div className="flex gap-10">
                <Button className="text-white bg-success-main">Voir plus</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
  )
}

export default AllPublications
