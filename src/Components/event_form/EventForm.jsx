import { useState } from "react";
import { format } from "date-fns";
import { axiosPrivate } from "../../api/axios";
import { useAtom } from "jotai";
import { bearerToken } from "../../atom/atoms";

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
  const [token, setToken] = useAtom(bearerToken);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosPrivate.post(
      "/events",
      {
        event: {  // Nesting the event data under the 'event' key
          category: category,
          title: title,
          start_date: startDate,
          end_date: endDate,
          price: price,
          location: location,
          description: description,
        }
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
      console.log("Event created successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error creating event:", error);
    });
  };
  

  return (
    <section className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center font-Ubuntu text-primary-dark md:text-2xl dark:text-white">
              CRÉATION D'ÉVÈNEMENT
            </h1>

            <form onSubmit={handleSubmit}>
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
                    type="numeric"
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
              <div className="flex justify-center flex-direction-column">
                <button
                  type="submit"
                  className="w-24 mt-10 text-white bg-success-main hover:bg-success-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Prochaine étape
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
