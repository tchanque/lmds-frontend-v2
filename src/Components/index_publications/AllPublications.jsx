import { axiosPrivate } from "../../api/axios";
import { useState, useEffect } from "react";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useAtom } from "jotai";
import {Button} from "@nextui-org/react";
import PopUpPublication from "../pop_up_publication/PopUpPublication";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./all_publications.css"
import defaultImage from "../../public/images/image_event.jpg"



function AllPublications() {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [allPublications, setAllPublications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [host] = useState("127.0.0.1:3000")

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
        console.log(allPublications);
        setAllPublications([...response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

 // Open popup and set selected event
 const openPopUp = async (publication) => {
  setSelectedPublication(publication);
  setShowPopup(true);
};

// Close popup and reset selected event
const closePopUp = async () => {
  setShowPopup(false);
  setSelectedPublication(null);
  window.location.reload()
};

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
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  return (
    <div className="max-w-screen-lg mx-auto">
      <Slider {...settings}>
        {allPublications
        .filter((publication) => publication.to_display)
        .map((publication) => (
          <div key={publication.id} className="relative">
           {publication.publication_picture_url ? ( 
            <img
              className="w-full rounded-lg"
              src={`http://127.0.0.1:3000${publication.publication_picture_url}`}
              alt={publication.title}
            />) : (
              <img
              className="w-full rounded-lg"
              src={defaultImage}
              alt={publication.title}
            />
            )}
            <div className="absolute bottom-0 w-full p-4 mb-4 text-center text-black transform -translate-x-1/2 bg-white shadow-2xl left-1/2 sm:w-3/4">
              <p className="mb-2 text-sm text-gray-500">
                {formatDate(publication.created_at)}
              </p>
              <h2 className="mb-2 text-2xl font-bold text-primary-dark">
                {publication.title}
              </h2>
              <p className="mb-4 text-sm text-primary-dark">
                {littleDescription(publication.description, 300)}
              </p>
              <div className="flex justify-end">
                <Button className="text-white bg-info-main" onClick={() => openPopUp(publication)}>
                  Voir Plus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      {showPopup && selectedPublication && (
        <PopUpPublication 
          selectedPublication={selectedPublication} 
          isVisible={showPopup}
          closePoPup={closePopUp} 
        />
      )}
    </div>
  )
}

export default AllPublications
