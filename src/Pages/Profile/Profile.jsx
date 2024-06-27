import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import default_avatar from "../../public/images/photo-avatar-profil.png";
import { useNavigate } from "react-router-dom";
import UserAgenda from "../../Components/user_agenda/UserAgenda";
import "./profile.css";

function Profile() {
  const { id } = useParams();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [token, setToken] = useAtom(bearerTokenAtom);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modifyMenu, setModifyMenu] = useState(false);
  const [modifyPicture, setModifyPicture] = useState(false);
  const [newPicture, setNewPicture] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("http://127.0.0.1:3000")

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

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
          setUser(response.data);
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          setDescription(response.data.description);
          setAvatarUrl(`http://127.0.0.1:3000${response.data.profile_picture_url}`)
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
  
  
  const handleSave = () => {
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      description: description,
    };

    axiosPrivate
      .patch(
        `/users/${id}`,
        { user: updatedUser },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setUser(response.data);
        setCurrentUser(response.data);
        setModifyMenu(false);
      })
      .catch((error) => {
        console.error("There was an error updating the user:", error);
      });
  };

  const handleDelete = async () => {
    try {
      axiosPrivate.delete(`/users/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setToken("");
      setCurrentUser("");
      navigate("/");
    } catch (error) {
      console.error("Error deleting the profile: ", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axiosPrivate.patch(
        `/users/${id}/change_password`,
        {
          user: {
            current_password: oldPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
          },
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const updateProfilePicture = async (e) => {
    e.preventDefault(); 
   
    const formData = new FormData();
    formData.append("user[profile_picture]", newPicture);

    try {
      const response = await axiosPrivate.patch(`users/${id}`, formData, {
        headers: {
          Authorization: token,
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setUser(response.data);
      setCurrentUser(response.data);
      setModifyPicture(false);
      setAvatarUrl(`http://127.0.0.1:3000${response.data.profile_picture_url}`)
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.errors.join(', '));
      } else if (error.request) {
        throw new Error('No response received from server.');
      } else {
        throw new Error('Error in setting up the request: ' + error.message);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPicture(file);
  };

  const handleModifyPicture = () => {
    setModifyPicture(true);
  }
  

  if (loading) {
    return (
      <div>
        <h1>Chargement</h1>
      </div>
    );
  }

  if (!token) return <div>Vous n'êtes pas autorisé</div>;
  if (!user) return <div>Pas de profil correspondant</div>;

  return (
    <>

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
            {user.profile_picture_url ? (
             <img
             className="w-full h-full object-cover"
             src={avatarUrl}
             alt="Photo de profil"
             onClick={handleModifyPicture}
             /> 
            ) : (
              <img
              className="w-full h-full object-cover"
              src={default_avatar}
              alt="Photo de profil"
              onClick={handleModifyPicture}
            /> 
            )}
          </div>

           
          {modifyPicture && user.id === currentUser.id && (
            <form onSubmit={updateProfilePicture} className="mt-4">
              <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="my-2 px-4 py-2 border rounded-md"            
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Valider
              </button>
            </form>
          )}

          <div className="flex flex-col items-center">
            {modifyMenu && user.id === currentUser.id ? (
              <>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-1/2 my-2 px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-1/2 my-2 px-4 py-2 border rounded-md"
                />
                <p>{user.email}</p>
              </>
            ) : (
              <>
                <p>
                  {firstName} {lastName}
                </p>
                <p>{user.email}</p>
                <img src="/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MiwicHVyIjoiYmxvYl9pZCJ9fQ==--f3fe27d3e4df506c6cb5dbbe63b53bb5802ebebb/4600_1_08_bis.jpg" alt="" />
              </>
            )}
          </div>
        <div className="bg-white mx-13 my-15 p-10 rounded-lg grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-2">
          <div className="col-span-1 lg:col-span-1 flex flex-col justify-center items-center">
            <div className="w-64 h-64 my-2 rounded-full overflow-hidden justify-center">
              <img
                className="w-full h-full object-cover"
                src={avatar}
                alt="Logo"
              />
            </div>

            <div className="flex flex-col">
              {modifyMenu && user.id === currentUser.id ? (
                <>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="py-2 border rounded-md text-grey-main font-Ubuntu text-center"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="py-2 border rounded-md text-grey-main font-Ubuntu text-center"
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center">
                    <p>{firstName}</p>
                    <p>{lastName}</p>
                  </div>
                </>
              )}
            </div>
            <p>{user.email}</p>
          </div>
          <div
            className="col-span-1 lg:col-span-2 flex flex-col"
            id="secondSection"
          >
            <div className="flex justify-evenly flex-wrap items-center">
              {user.skills.map((skill, index) => (
                <div
                  className="flex flex-col items-center"
                  key={`instruments${index}`}
                >
                  <p>{skill.instrument.name}</p>
                  <p>{`Niveau ${skill.level}`}</p>
                </div>
              ))}
            </div>
            <div
              className="flex flex-col justify-center items-center flex-grow"
              id="descriptionSection"
            >
              <h4>Description</h4>
              <div className="w-2/3 sm:w-full flex flex-grow items-center transition-all duration-300 ease-in-out">
                {modifyMenu ? (
                  <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full h-full px-2 py-2 border rounded-md break-words text-grey-main text-center font-Ubuntu resize-none"
                  />
                ) : (
                  <p className="w-full h-full px-2 py-2 text-center overflow-auto">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center" id="editButton">
              {modifyMenu ? (
                <>
                  <button
                    onClick={() => setModifyMenu(false)}
                    className="w-24 mt-10 text-white bg-warning-main hover:bg-warning-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-24 mt-10 text-white bg-success-main hover:bg-success-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ml-5"
                  >
                    Sauvegarder
                  </button>
                </>
              ) : (
                (user.id === currentUser.id ||
                  currentUser.role === "Admin") && (
                  <>
                    <button
                      onClick={() => setModifyMenu(true)}
                      className="w-24 mt-10 text-white bg-info-main hover:bg-info-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Es-tu sûr de vouloir supprimer ton compte?"
                          )
                        ) {
                          handleDelete();
                        }
                      }}
                      className="w-24 mt-10 text-white bg-danger-main hover:bg-danger-light font-medium rounded-lg text-sm py-2.5 ml-5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Supprimer
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        {user.id === currentUser.id && ( // only the user can change its password
          <div
            id="passwordSection"
            className="bg-white mx-13 my-15 p-10 rounded-lg"
          >
            <div className="flex flex-col items-center">
              <h4>Changer mon mot de passe</h4>
              <input
                className="w-full sm:w-1/2 my-2 px-4 py-2 border rounded-md transition-all duration-300 ease-in-out"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Ancien mot de passe"
              />
              <input
                className="w-full sm:w-1/2 my-2 px-4 py-2 border rounded-md transition-all duration-300 ease-in-out"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
              />
              <input
                className="w-full sm:w-1/2 my-2 px-4 py-2 border rounded-md transition-all duration-300 ease-in-out"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer nouveau mot de passe"
              />
              <button
                onClick={handleChangePassword}
                className="w-24 text-white bg-info-main hover:bg-info-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Changer
              </button>
            </div>
          </div>
        )}
        <div id="agenda">
          {user.id === currentUser.id && <UserAgenda userId={id} />}
        </div>
      </section>
    </>
  );
}

export default Profile;
