import { axiosPrivate } from "../../api/axios";
import { useState, useEffect } from "react";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useAtom } from "jotai";
import {Button} from "@nextui-org/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./all_publications.css"



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

const littleDescription = (text, maxLength) => {
  if (text.length <= maxLength) 
    return text;
  return text.substring(0, maxLength) + "...";
};

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  return (
    <div className="max-w-screen-lg mx-auto">
    <Slider {...settings}>
      {allPublications.map((publication) => (
        <div key={publication.id} className="relative">
          <img
            className="w-full rounded-lg"
            src="https://cdn.pixabay.com/photo/2024/05/18/08/16/cat-8769861_1280.jpg"
            alt={publication.title}
          />
           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white text-black w-full sm:w-3/4 p-4 shadow-2xl mb-4 text-center">
           <p className="text-gray-500 text-sm mb-2">{formatDate(publication.created_at)}</p>
              <h2 className="text-primary-dark text-2xl font-bold mb-2">{publication.title}</h2>
              <p className="text-primary-dark text-sm mb-4">{littleDescription(publication.description, 300)}</p>
              <div className="flex justify-end">
                <button className="text-white bg-primary-main py-2 px-4 rounded">Voir plus</button>
              </div>
            </div>
        </div>
      ))}
    </Slider>
  </div>
  )
}

export default AllPublications
