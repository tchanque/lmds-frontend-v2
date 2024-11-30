import { useState, useEffect } from "react";
import { format } from "date-fns";
import { axiosPrivate } from "../../api/axios";
import { useAtom } from "jotai";
import { bearerTokenAtom, popUpEventAtom } from "../../atom/atoms";
import EventInstrumentForm from "./event_instrument_form/EventInstrumentForm";
import "./eventForm.css";

const EventForm = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
  );
  const [endDate, setEndDate] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
  );
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useAtom(bearerTokenAtom);

  const [eventInstruments, setEventInstruments] = useState([]);

  const [popUpEvent, setPopUpEvent] = useAtom(popUpEventAtom);
  const [eventPicture, setEventPicture] = useState(null);
  const [eventFile, setEventFile] = useState();


  const addEventInstrumentForm = (e) => {
    e.preventDefault();
    setEventInstruments([
      ...eventInstruments,
      { id: eventInstruments.length, instrument: "", level: [], totalSpots: 0 },
    ]);
  };

  const handleInstrumentChange = (id, field, value) => {
    setEventInstruments((prev) =>
      prev.map((instrument) =>
        instrument.id === id ? { ...instrument, [field]: value } : instrument
      )
    );
  };

  const handleInstrumentDestroy = (id) => {
    setEventInstruments((prev) =>
      prev.filter((instrument) => instrument.id !== id)
    );
  };


  const handleClosePopUpEvent = () => {
    setPopUpEvent(false);
  };

  useEffect(() => {
    validateForm();
  }, [category, eventInstruments]);

  const validateForm = () => {
    if (eventInstruments.some((instrument) => instrument.level.length === 0 || !instrument.instrument || instrument.totalSpots <1 || !instrument.totalSpots) || !category || !title || !startDate || !endDate || !price || !location || !description )  { 
      return true;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("event[category]", category);
    formData.append("event[title]", title);
    formData.append("event[start_date]", startDate);
    formData.append("event[end_date]", endDate);
    formData.append("event[price]", price);
    formData.append("event[location]", location);
    formData.append("event[description]", description);
    if (eventPicture) {
      formData.append("event[event_picture]", eventPicture);
    }
    axiosPrivate
      .post(
        "/events", formData, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log("Event created successfully:", response.data);
        // creation of the event_instruments for each selected instrument
        if (eventInstruments.length > 0) {
          eventInstruments.map((eventInstrumentData) => {
            axiosPrivate
              .post(
                "/event_instruments",
                {
                  event_instrument: {
                    event_id: response.data.id,
                    instrument_name: eventInstrumentData.instrument,
                    level: Array.from(eventInstrumentData.level)
                      .sort()
                      .join(", "),
                    total_spots: eventInstrumentData.totalSpots,
                    available_spots: eventInstrumentData.totalSpots,
                  },
                },
                {
                  headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              )
              .then((response) => {
                handleClosePopUpEvent();
                window.location.reload();
                // console.log(response);
              });
          });
          // Creation of Aucun instrument if no instrument is selected
        } else {
          axiosPrivate
            .post('/event_instruments', {
              event_instrument: {
                event_id: response.data.id,
                instrument_name: "Aucun",
                level: "aucun niveau requis",
                total_spots: 999,
                available_spots: 999,
              }
          },{
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
          handleClosePopUpEvent();
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventPicture(file);
    setEventFile(URL.createObjectURL(file));
  };

  if (popUpEvent)
  return (
    <section className="dark:bg-gray-900">
      <div className={`modal ${popUpEvent ? 'is-active' : ''}`}>
        <div className=" modal-overlay">
          <div className="modal-content-event">
            <button onClick={handleClosePopUpEvent} className="modal-close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 50 50"
                fill="#F31248"
              >
                <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                stroke="#F31248"
                strokeWidth={1.5}
                ></path>
              </svg>
            </button>
            <h1 className="mb-8 text-xl font-bold leading-tight tracking-tight text-center font-Ubuntu text-primary-dark md:text-2xl dark:text-white">
              CRÉATION D'ÉVÈNEMENT
            </h1>

            <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center mb-5">
              {/* <img src={missingImage} alt="" /> */}
              <img src={eventFile} alt="" />
              <input 
              type="file" 
              onChange={handleFileChange}
              accept="image/*"
              className="mt-2"
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
              <div
                id="EventInstrumentForm"
                className="flex flex-col items-center mt-5"
              >
                {eventInstruments.map((instrument, index) => (
                  <EventInstrumentForm
                    key={index}
                    id={instrument.id}
                    instrument={instrument}
                    onInstrumentChange={handleInstrumentChange}
                    onInstrumentDestroy={handleInstrumentDestroy}
                  />
                ))}
                <h6>Ajouter un instrument</h6>
                <button onClick={addEventInstrumentForm} className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#17A964"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#FFFF"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
              {/* <button onClick={printInstruments}>Print les instruments</button> */}
              <div className="flex justify-center flex-direction-column">
                <button
                  type="submit"
                  disabled={validateForm()}
                  className={`w-24 mt-10 text-white ${
                    validateForm()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-success-main hover:bg-success-light"
                  } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                  // onClick={() => handleSubmit}
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventForm;