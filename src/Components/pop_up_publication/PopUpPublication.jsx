/* eslint-disable react/prop-types */
import "./popup_publication.css";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom, bearerTokenAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";
import defaultImage from "../../public/images/image_event.jpg"

const PopUpPublication = ({ selectedPublication, closePoPup}) => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [updatedPublication, setUpdatedPublication] = useState({
    title: selectedPublication.title,
    description: selectedPublication.description,
    to_display: selectedPublication.to_display,
    publication_picture: selectedPublication.publication_picture_url
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [publicationPicture, setPublicationPicture] = useState(null);
  const [publicationFile, setPublicationFile] = useState();

  
  // Ensuring token and current user are set
  // useEffect(() => {
  //   if (!token) {
  //     setToken(bearerTokenAtom);
  //   }
  //   if (!currentUser) {
  //     setCurrentUser(currentUserAtom);
  //   }
  // }, [token, currentUser]);
// I LET THIS HERE BECAUSE I'M NOT TOTALLY SURE. BUT WHEN I'M A GUEST AND I WANT TO SEE MORE FOR A POPUP, IT'S CREATE ME A CURRENT USER UNDIFENED


  
  if (!selectedPublication) {
    return null;
  }

  const startUpdating = () => {
    setIsUpdating(true);
  };

// Function to handle delete publication
const handleDeletePublication = async () => {
  try {
    const response = await axiosPrivate.delete(
      `/publications/${selectedPublication.id}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    // console.log("Publication deleted:", response.data);
    closePoPup();
    window.location.reload();
  } catch (error) {
    console.error("Failed to delete publication:", error);
    // Handle error scenarios
  }
};

const handleUpdatePublication = async () => {

  const formData = new FormData();
    
    formData.append("publication[title]", updatedPublication.title);
    formData.append("publication[description]", updatedPublication.description);
    formData.append("publication[to_display]", updatedPublication.to_display);
    if (publicationPicture) {
      formData.append("publication[publication_picture]", publicationPicture)
    }

  try {
    const response = await axiosPrivate.patch(
      `/publications/${selectedPublication.id}`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    // console.log("Publication updated:", response.data);

    if (response.data.to_display === true) {
    setIsUpdating(false)

    // Màj selectedPublication pour refléter les changements
      selectedPublication.title = response.data.title;
      selectedPublication.description = response.data.description;
      selectedPublication.to_display = response.data.to_display;
      selectedPublication.publication_picture_url = response.data.publication_picture_url

      setUpdatedPublication({
        title: response.data.title,
        description: response.data.description,
        to_display: response.data.to_display,
        publication_picture: response.data.publication_picture_url
      });
     } else {
    closePoPup();
    window.location.reload();
     }
  } catch (error) {
    console.error("Failed to update publication:", error);
    // Handle error scenarios
  }
};

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setUpdatedPublication({
    ...updatedPublication,
    [name]: type === "checkbox" ? checked : value,
  });
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setPublicationPicture(file);
  setPublicationFile(URL.createObjectURL(file));
};

  return (
    <>
      <div className="modal is-active">
        <div className="flex flex-col modal-content">
          <div className="mt-6">
            {publicationFile ? (
              <img
              className="w-full publication__img"
              src={publicationFile}
              alt="Publication Preview"
            />
            ) : selectedPublication.publication_picture_url ? (
              <img
              className="w-full publication__img"
              src={selectedPublication.publication_picture_url}
              alt=""
            />
            ) : (
              <img
              className="w-full publication__img"
              src={defaultImage}
              alt="default image"
            />
            )}
            {isUpdating && (
              <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="px-4 py-2 my-2 border rounded-md"            
              />   
            )}
          </div>
          <div className="flex flex-col items-center gap-8 p-2">
            <div className="text-center ">
              {isUpdating ? (
                <input
                  type="text"
                  name="title"
                  value={updatedPublication.title}
                  onChange={handleChange}
                  className="p-2 border-2 rounded-lg border-primary-main"
                />
              ) : (
                <h2>{selectedPublication.title}</h2>
               
              )}
            </div>

            <div className="text-center">
              {isUpdating ? (
                <textarea
                  name="description"
                  value={updatedPublication.description}
                  onChange={handleChange}
                  className="p-2 border-2 rounded-lg border-primary-main"
                />
              ) : (
                <p>{selectedPublication.description}</p>
              )}
            </div>

            <div className="text-center">
              {isUpdating ? (
                <label>
                  <input
                    type="checkbox"
                    name="to_display"
                    checked={updatedPublication.to_display}
                    onChange={handleChange}
                  />
                  Afficher l'actualité
                </label>
              ) : (
                <div></div>
              )}
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
          {currentUser && currentUser.role === "Admin" ? (
          <div className="flex justify-end gap-4 mt-4">
            {!isUpdating && (
              <Button
                className="text-white bg-primary-main"
                onClick={startUpdating}
              >
                Mettre à jour
              </Button>
            )}
            {!isUpdating && (
              <Button
                className="text-white bg-danger-main"
                onClick={handleDeletePublication}
              >
                Supprimer
              </Button>
            )}
            {isUpdating && (
              <>
                <Button
                  className="text-white bg-success-main"
                  onClick={handleUpdatePublication}
                >
                  Valider
                </Button>
                <Button
                  className="text-white bg-warning-main"
                  onClick={() => setIsUpdating(false)}
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
          ) : null} 
        </div>
      </div>
    </>
  )
}

export default PopUpPublication
