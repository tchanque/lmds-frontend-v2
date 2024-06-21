import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import avatar from "../../public/images/profile_picture.jpeg";

import "./profile.css";

function Profile() {
  const { id } = useParams();

  const [currentUser] = useAtom(currentUserAtom);
  const [token] = useAtom(bearerTokenAtom);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifyMenu, setModifyMenu] = useState(false);

  useEffect(() => {
    if (token) {
      axiosPrivate
        .get(`/users/${id}`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data)
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, token]);

  if (loading) return;
  <div>
    <h1>Chargement</h1>
  </div>;

  if (!token) return <div>Vous n'êtes pas autorisé</div>;
  if (!user) return <div>Pas de profil correspondant</div>;

  if (!modifyMenu)
    return (
      <section className="h-full">
        <div className="title">
          {user.id === currentUser.id ? (
            <h1>MON COMPTE</h1>
          ) : (
            <h1>PROFIL MUSICIEN</h1>
          )}
        </div>
        <div className="userProfileDetails bg-white mx-13 mt-24 p-10 rounded-lg">
          <div className="mainInformationSection flex flex-col justify-center items-center">
            <div className="w-64 h-64 rounded-full overflow-hidden justify-center">
              <img
                className="w-full h-full object-cover"
                src={avatar}
                alt="Logo"
              />
            </div>
            <div className="flex flex-col items-center">
              <p>
                {user.first_name} {user.last_name}
              </p>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="secondaryInformationSection ml-10 relative">
            <div className="flex">
              {
                user.skills.map((skill) => (
                  <h1>skill.instrument</h1>
                ))
              }
              <div className="mr-13" id="instrument1">
                <p>Piano</p>
                <p>Niveau 3</p>
              </div>
              <div className="mr-13" id="instrument2">
                <p>Guitare</p>
                <p>Niveau 4</p>
              </div>
            </div>
            <div className="description">
              <h4>Description</h4>
              <p>{user.description}</p>
            </div>
            <div className="absolute bottom-0 right-10">
              <button
                onClick={() => setModifyMenu(true)}
                className="w-24 mt-10 text-white bg-info-main hover:bg-info-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section className="h-full">
      <form action=""></form>
      <div className="title">
        {user.id === currentUser.id ? (
          <h1>MON COMPTE</h1>
        ) : (
          <h1>PROFIL MUSICIEN</h1>
        )}
      </div>
      <div className="userProfileDetails bg-white mx-13 mt-24 p-10 rounded-lg">
        <div className="mainInformationSection flex flex-col justify-center items-center">
          <div className="w-64 h-64 rounded-full overflow-hidden justify-center">
            <img
              className="w-full h-full object-cover"
              src={avatar}
              alt="Logo"
            />
          </div>
          <div className="flex flex-col items-center">
            <p>
              {user.first_name} {user.last_name}
            </p>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="secondaryInformationSection ml-10 relative">
          <div className="flex">
            <div className="mr-13" id="instrument1">
              <p>Piano</p>
              <p>Niveau 3</p>
            </div>
            <div className="mr-13" id="instrument2">
              <p>Guitare</p>
              <p>Niveau 4</p>
            </div>
          </div>
          <div className="description">
            <h4>Description</h4>
            <input type="text" placeholder={user.description} />
          </div>
          <div className="absolute bottom-0 right-10 flex space-x-5">
            <button
              onClick={() => setModifyMenu(false)}
              className="w-24 text-white bg-warning-main hover:bg-warning-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Retour
            </button>
            <button
              onClick={() => setModifyMenu(false)}
              className="w-24 text-white bg-success-main hover:bg-success-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col">
            <h4>Changer mon mot de passe</h4>
            <input className="w-1/2 my-2 px-4 py-2 border rounded-md" type="text" placeholder="Ancien mot de passe" />
            <input className="w-1/2 my-2 px-4 py-2 border rounded-md" placeholder="Nouveau mot de passe" />
            <input className="w-1/2 my-2 px-4 py-2 border rounded-md" placeholder="Confirmer nouveau mot de passe" />
          </div> */}
    </section>
  );
}

export default Profile;
