import './publicationForm.css'
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { bearerTokenAtom, currentUserAtom, popUpPublicationAtom } from '../../atom/atoms';
import { axiosPrivate } from '../../api/axios';

const PublicationForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [popUpPublication, setPopUpPublication] = useAtom(popUpPublicationAtom);
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [toDisplay, setToDisplay] = useState(true);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  const [publicationPicture, setPublicationPicture] = useState(null);
  const [publicationFile, setPublicationFile] = useState();


  const handleClosePopUpPublication = () => {
    setPopUpPublication(false);
  };

  useEffect(() => {
    validateForm();
  }, []);

  const validateForm = () => {
    if ( !title || !description )  { 
      return true;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    formData.append("publication[title]", title);
    formData.append("publication[description]", description);
    formData.append("publication[to_display]", toDisplay);
    formData.append("publication[publication_picture]", publicationPicture);


    axiosPrivate
      .post(
        "/publications", formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log("Publication created successfully:", response.data);
        handleClosePopUpPublication();
        window.location.reload();
        }
      )
      .catch((error) => {
        console.error("Error creating publication:", error);
      });   
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setPublicationPicture(file);
      setPublicationFile(URL.createObjectURL(file));
    };


  if (popUpPublication)
    return (
      <section className="dark:bg-gray-900">
        <div className={`modal ${popUpPublication ? 'is-active' : ''}`}>
          <div className=" modal-overlay">
            <div className="modal-content-publication">
              <button onClick={handleClosePopUpPublication} className="modal-close">
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
                CRÉATION DE PUBLICATION
              </h1>
  
              <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center mb-5">
              {/* <img src={missingImage} alt="" /> */}
              <img src={publicationFile} alt="" />
              <input 
              type="file" 
              onChange={handleFileChange}
              accept="image/*"
              className="mt-2"
              />
            </div>
                <div className="">
                   <div className='my-8'>
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
              </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }


export default PublicationForm;