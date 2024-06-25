import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import SkillsForm from "../../skills/SkillsForm";
import { useAtom } from "jotai";
import { bearerTokenAtom, popUpAdminFormAtom } from "../../../atom/atoms";
import './adminRegistrationForm.css'

const AdminRegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [isSubscriber, setIsSubscriber] = useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState([]);
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [popUpAdminForm, setPopUpAdminForm] = useAtom(popUpAdminFormAtom);

  // Password Generation
  const generatePassword = () => {
    const length = 8;
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let password = "";
    password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
    password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    const allChars = lowerCase + upperCase + numbers + symbols;

    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    const PASSWORD_FORMAT =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\[\]{}|;:,.<>?]{8,}$/;

    if (!PASSWORD_FORMAT.test(password)) {
      return generatePassword();
    }

    setPassword(password);
  };
  // END Password Generation

  const addSkillsForm = (e) => {
    e.preventDefault();
    setSkills([
      ...skills,
      { id: skills.length, instrument: "", level: [] },
    ]);
  };

  const handleSkillsChange = (id, field, value) => {
    setSkills((prev) =>
      prev.map((instrument) =>
        instrument.id === id ? { ...instrument, [field]: value } : instrument
      )
    );
  };

  const handleSkillsDestroy = (id) => {
    setSkills((prev) =>
      prev.filter((instrument) => instrument.id !== id)
    );
  };

  const closePopUp = () => {
    setPopUpAdminForm(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosPrivate
      .post("/users", {
        user: {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
          role: role,
          subscription_end_date: subscriptionEndDate,
          is_subscriber: isSubscriber,
        },
      })
      .then((response) => {
        console.log("User created successfully:", response.data);
        if (skills.length > 0) {
          skills.map((skillData) => {
            axiosPrivate
              .post(
                "/skills",
                {
                  skill: {
                    musician_id: response.data.user.id,
                    instrument_name: skillData.instrument,
                    level: Array.from(skillData.level)
                      .sort()
                      .join(", "),
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
                window.location.reload();
                console.log(response);
              });
          });
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else {
          console.error(error);
        }
      });
  };

  if (popUpAdminForm)
  return (
    <>
    {popUpAdminForm && (
    <section>
      <div className={`modal ${popUpAdminForm ? 'is-active' : ''}`}>
        <div className="modal-overlay">
          <div className="modal-content-admin">
          <button onClick={closePopUp} className="modal-close">
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
            <h1 className="text-xl font-bold font-Ubuntu leading-tight text-center tracking-tight text-primary-dark md:text-2xl dark:text-white">
              CRÉATION DE COMPTE
            </h1>

            <form action="#" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nom@test.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Statut
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="statut"
                    required
                  >
                    <option value="">Choisissez une option</option>
                    <option value="Etudiant">Étudiant</option>
                    <option value="Professeur">Professeur</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nom"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="isSubsciber"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Est adhérent ?
                  </label>
                  <select
                    name="isSubsciber"
                    id="isSubsciber"
                    value={isSubscriber}
                    onChange={(e) => setIsSubscriber(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="est adhérent ?"
                    required
                  >
                    <option value="">Choisissez une option</option>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subscriptionEndDate"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Fin de Souscription
                  </label>
                  <input
                    type="date"
                    name="subscriptionEndDate"
                    id="subscriptionEndDate"
                    value={subscriptionEndDate}
                    onChange={(e) => setSubscriptionEndDate(e.target.value)}
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="fin de souscription"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-evenly mt-5 gap-x-3">
                <div className="flex-grow">
                  <label
                    htmlFor="password"
                    className="block mb-2 font-hind-vadodara text-center text-sm font-medium text-grey-main dark:text-white"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    readOnly
                    className="bg-gray-50 border border-primary-main text-grey-main text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mot de passe"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="w-24 mt-7 text-white bg-primary-main hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Générer
                </button>
              </div>

              <div
                id="SkillsForm"
                className="flex flex-col items-center mt-5"
              >
                {skills.map((instrument, index) => (
                  <SkillsForm
                    key={index}
                    id={instrument.id}
                    instrument={instrument}
                    onInstrumentChange={handleSkillsChange}
                    onInstrumentDestroy={handleSkillsDestroy}
                  />
                ))}
                <h6>Ajouter un skill</h6>
                <button onClick={addSkillsForm} className="">
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

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-24 mt-10 text-white bg-success-main hover:bg-success-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    )}
    </>
  );
};

export default AdminRegistrationForm;
