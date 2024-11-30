import "./popup_event.css";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom, bearerTokenAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";
import parse from "html-react-parser";
import { format } from "date-fns";
import defaultImage from "../../public/images/image_event.jpg";
import { useNavigate } from "react-router-dom";

const PopUpEvent = ({
  selectedEvent,
  closePoPup,
  isAttendee,
  setUserAttendance,
  attendance,
}) => {
  const [choice, setChoice] = useState(null);
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [loading, setLoading] = useState(false);
  const [hasAvailableSpots, setHasAvailableSpots] = useState(true);
  const [message, setMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // ELEMENT FOR UPDATE
  const [category, setCategory] = useState(selectedEvent.category);
  const [title, setTitle] = useState(selectedEvent.title);
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
  const [startDate, setStartDate] = useState(
    formatDate(new Date(selectedEvent.start_date), "yyyy-MM-dd'T'HH:mm:ss")
  );
  const [endDate, setEndDate] = useState(
    formatDate(new Date(selectedEvent.end_date), "yyyy-MM-dd'T'HH:mm:ss")
  );
  const [price, setPrice] = useState(selectedEvent.price);
  const [location, setLocation] = useState(selectedEvent.location);
  const [description, setDescription] = useState(selectedEvent.description);
  const [eventPicture, setEventPicture] = useState(null);
  const [eventFile, setEventFile] = useState();

  // Ensure token and current user are set
  useEffect(() => {
    if (!token || !currentUser) {
      console.error("Token or current user is not set.");
    }
  }, [token, currentUser]);

  // Determine if instrument selection should be displayed
  const shouldDisplayInstruments = () => {
    if (selectedEvent.event_instruments.length === 0) {
      return false;
    }
    if (
      selectedEvent.event_instruments.length === 1 &&
      selectedEvent.event_instruments[0].instrument.name.toLowerCase() ===
        "aucun"
    ) {
      return false;
    }
    return true;
  };

  // Handle event registration
  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    const eventInstrumentId = shouldDisplayInstruments()
      ? choice
      : selectedEvent.event_instruments[0].id; //Select the only one event_instrument.  "Aucun"

    try {
      const response = await axiosPrivate.post(
        "/attendances",
        {
          attendance: {
            attendee_id: currentUser.id,
            event_id: selectedEvent.id,
            is_pending: !hasAvailableSpots,
            event_instrument_id: eventInstrumentId,
          },
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // if response.data is-pending est true et que à l'inscription hasAvailableSpots est true : Popup : Désolé, quelqu'un s'est inscrit avant toi !
      // if response.data is-pending est false et que à l'inscription hasAvailableSpots est false : Popup : Bravo, une place c'est libérée au moment de ton inscription  !
// 
      // console.log(response.data);
      if (response.data.is_pending && hasAvailableSpots) {
        // Popup: Désolé, quelqu'un s'est inscrit avant toi !
        // console.log("Désolé, quelqu'un s'est inscrit avant toi !");
        // Show message on the screen
        setMessage(
          "<p className='text-danger-main'>Désolé, il semblerait que quelqu'un se soit inscrit avant vous ! Vous êtes en liste d'attente.</p>"
        );
      } else if (!response.data.is_pending && !hasAvailableSpots) {
        // Popup: Bravo, une place c'est libérée au moment de ton inscription
        console.log(
          // "Bravo, une place c'est libérée au moment de ton inscription !"
        );
        // Show message on the screen
        setMessage(
          "<p className='text-success-main'>Woaw ! Une place c'est libérée au moment de ton inscription !</p>"
        );
      }
      await setUserAttendance(selectedEvent);
      setChoice(null); // Update attendance status after registration
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle event unsubscription
  const handleUnsubscribe = async () => {
    setLoading(true);
    // console.log(selectedEvent)
    try {
      await Promise.all(
        attendance.map((att) =>
          axiosPrivate.delete(`/attendances/${att.id}`, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        )
      );
      await setUserAttendance(selectedEvent);
      setChoice(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Update attendance status after unsubscription
    }
  };

  useEffect(() => {
    if (choice) {
      // vérifier si places disponibles
      // update hasAvailableSpots => true or false
      const chosenEventInstrument = selectedEvent.event_instruments.filter(
        (eachEventInstrument) => eachEventInstrument.id === parseInt(choice)
      )[0];
      if (chosenEventInstrument.available_spots > 0) {
        setHasAvailableSpots(true);
      } else {
        setHasAvailableSpots(false);
      }
    }
  }, [choice]);

  const handleEdit = () => {
    setIsUpdating(!isUpdating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("event[title]", title)
    formData.append("event[description]", description)
    formData.append("event[category]", category)
    formData.append("event[price]", price)
    formData.append("event[start_date]", startDate)
    formData.append("event[end_date]", endDate)
    formData.append("event[location]", location)
    if (eventPicture) {
      formData.append("event[event_picture]", eventPicture);
    }

    axiosPrivate
      .patch(
        `/events/${selectedEvent.id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        // Handle success if needed
        // console.log("Event updated successfully:", response.data);
        handleEdit();
        window.location.reload();
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Error updating event:", error);
      });
  };

  const handleDelete = async () => {
    try {
      axiosPrivate.delete(`/events/${selectedEvent.id}`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
      window.location.reload()
      // console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting the event: ", error);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventPicture(file);
    setEventFile(URL.createObjectURL(file));
  };

  if (loading) {
    return <h1> IS LOADING</h1>;
  }

  return (
    <>
    {!isUpdating ? (
      <div className="modal is-active">
        <div className="flex justify-around modal-content">
          <div className="flex items-center justify-center">
            {selectedEvent.event_picture_url ? (
              <img
                src={selectedEvent.event_picture_url}
                alt={title}
                className=""
              />
            ) : (
              <img src={defaultImage} alt="default image" className="" />
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-8 p-2 event_information">
            <div className="text-center title__event-container">
              <h2 className="">{category}</h2>
              <p className="">{title}</p>
            </div>
            <div className="text-center date">
              <h2>Date</h2>
              <p>{startDate} - {endDate}</p>
            </div>
            <div className="text-center pricing">
              <h2>Prix</h2>
              <p>{price} €</p>
            </div>
            <div className="text-center event_description">
              <h2>Description</h2>
              <p>{description}</p>
            </div>
            <div className="text-center location">
              <h2>Lieu</h2>
              <p>{location}</p>
            </div>
            <div className="text-center attendances">
              <h2>Liste des participants</h2>
              <div className="flex justify-center gap-5">
                {selectedEvent.event_instruments
                  .filter(
                    (instrument) =>
                      instrument.instrument.name.toLowerCase() !== "aucun"
                  )
                  .map((instrument, instrumentIndex) => (
                    <div key={instrumentIndex} className="flex flex-col">
                      <p>
                        {instrument.instrument.name}{" "}
                        {instrument.available_spots}/{instrument.total_spots}
                      </p>
                      {instrument.attendances
                        .filter((attendee) => !attendee.is_pending)
                        .map((attendee, attendeeIndex) => (
                          <p key={attendeeIndex}>
                            {attendee.attendee.first_name}
                          </p>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
            
            {currentUser ? (!isAttendee ? (
              shouldDisplayInstruments() ? (
                <div>
                  <h2>Choisissez un instrument</h2>
                  <form className="text-center" onSubmit={handleInscription}>
                    <div className="flex items-center justify-center gap-5">
                      {selectedEvent.event_instruments
                        .filter(
                          (instrument) =>
                            instrument.instrument.name.toLowerCase() !== "aucun"
                        )
                        .map((instrument, index) => (
                          <div key={index} className="instrument-radio">
                            <input
                              type="radio"
                              id={`instrument-${index}`}
                              name="instrument"
                              value={instrument.id}
                              onClick={(e) => {
                                setChoice(e.target.value);
                                setHasAvailableSpots(true);
                              }}
                            />
                            <label htmlFor={`instrument-${index}`}>
                              {instrument.instrument.name}
                            </label>
                          </div>
                        ))}
                      <button
                        type="reset"
                        className="p-1 text-white rounded-full bg-danger-main"
                        onClick={() => {
                          setChoice(null);
                          setHasAvailableSpots(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    {hasAvailableSpots ? (
                      <Button
                        className="mt-5 text-white bg-success-main"
                        type="submit"
                        isDisabled={!choice}
                      >
                        Je participe
                      </Button>
                    ) : (
                      <Button
                        className="mt-5 text-white bg-success-main"
                        type="submit"
                      >
                        Liste d'attente
                      </Button>
                    )}
                  </form>
                </div>
              ) : (
                <Button
                  className="text-white bg-success-main"
                  onClick={handleInscription}
                >
                  Je participe
                </Button>
              )
            ) : (
              <Button
                className="text-white bg-warning-main"
                onClick={() => {
                  handleUnsubscribe();
                  setChoice(null);
                  setMessage(null);
                }}
              >
                Je me désinscris
              </Button>
            )) : null}
            
            {(currentUser && (currentUser.role === "Admin" || currentUser.id === selectedEvent.creator_id)) && (
              <div className="flex gap-5 adminBtn">
                <Button
                  className="font-bold text-white bg-primary-main"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  className="font-bold text-white bg-danger-main"
                  onClick={() => {
                    if (window.confirm("Es-tu sûr de vouloir supprimer cet évènement?")) {
                      handleDelete();
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
            {message ? <div>{parse(message)}</div> : null}
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
      ) : (
        <>
          <div className="modal is-active">
            <div className="flex flex-col items-center modal-content">
              <div className="title_form">
                <h2>MODIFIER ÉVÈNEMENT</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  {eventFile ? (
                    <img
                      className="w-full publication__img"
                      src={eventFile}
                      alt="Event Preview"
                    />
                  ) : selectedEvent.event_picture_url ? (
                    <img
                      src={`http://127.0.0.1:3000${selectedEvent.event_picture_url}`}
                      alt={title}
                      className=""
                    />
                  ) : (
                    <img
                      className="w-full publication__img"
                      src={defaultImage}
                      alt="default image"
                    />
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="px-4 py-2 my-2 text-center border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Catégorie
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Catégorie de votre évènement"
                      required
                    >
                      <option hidden value="">
                        Choisissez une catégorie
                      </option>
                      <option value="Atelier">Atelier</option>
                      <option value="Concert">Concert</option>
                      <option value="Permanence">Permanence</option>
                      <option value="Stage">Stage</option>
                      <option value="Scène ouverte">Scène ouverte</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Titre
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Entre un titre pour l'évènement"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="start_date"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Date de début
                    </label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      id="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Date de début"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end_date"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Date de fin
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      id="end_date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Date de fin"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Prix
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="0 si gratuit"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Lieu
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="119 Bd de Sébastopol, 75002 Paris"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-5 flex-direction-column">
                  <div className="w-full">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-center font-hind-vadodara text-grey-main dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Ajoute une description"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                <Button type="submit" className="m-5 bg-success-main">
                  Accepter
                </Button>
                <Button onClick={handleEdit} className="m-5 bg-warning-main">
                  Annuler
                </Button>
                </div>

              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PopUpEvent;
