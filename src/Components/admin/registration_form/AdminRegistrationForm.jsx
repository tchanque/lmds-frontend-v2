import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";

const AdminRegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [isSubscriber, setIsSubscriber] = useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(response);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <section className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
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
  );
};

export default AdminRegistrationForm;
