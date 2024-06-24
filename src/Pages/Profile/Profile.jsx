import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import avatar from "../../public/images/profile_picture.jpeg";
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
      axiosPrivate.delete(
        `/users/${id}`,
        {headers: 
          {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )
      setToken("");
      setCurrentUser("");
      navigate("/");
    }
    catch (error) {
      console.error("Error deleting the profile: ", error)
    }
  }

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
            <img
              className="w-full h-full object-cover"
              src={avatar}
              alt="Logo"
            />
          </div>
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
              </>
            )}
          </div>
        </div>
        <div className="secondaryInformationSection ml-10 relative">
          <div className="flex">
            {user.skills.map((skill, index) => (
              <div className="mr-13" key={`instruments${index}`}>
                <p>{skill.instrument.name}</p>
                <p>{`Niveau ${skill.level}`}</p>
              </div>
            ))}
          </div>
          <div className="description">
            <h4>Description</h4>
            {modifyMenu && user.id === currentUser.id ? (
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full my-2 px-4 py-2 border rounded-md"
              />
            ) : (
              <p>{description}</p>
            )}
          </div>
          <div className="absolute bottom-0 right-10">
            {modifyMenu && user.id === currentUser.id ? (
              <>
                <button
                  onClick={() => setModifyMenu(false)}
                  className="w-24 mt-10 text-white bg-danger-main hover:bg-danger-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
              user.id === currentUser.id && (
                <>
                  <button
                    onClick={() => setModifyMenu(true)}
                    className="w-24 mt-10 text-white bg-info-main hover:bg-info-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-24 mt-10 text-white bg-danger-main hover:bg-danger-light font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Supprimer
                  </button>
                </>
              )
            )}
          </div>
        </div>
        {user.id === currentUser.id && (
          <div className="changePasswordSection mt-10">
            <h4>Changer mon mot de passe</h4>
            <input
              className="w-1/2 my-2 px-4 py-2 border rounded-md"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Ancien mot de passe"
            />
            <input
              className="w-1/2 my-2 px-4 py-2 border rounded-md"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
            />
            <input
              className="w-1/2 my-2 px-4 py-2 border rounded-md"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer nouveau mot de passe"
            />
            <button
              onClick={handleChangePassword}
              className="w-24 mt-10 text-white bg-info-main hover:bg-info-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Changer
            </button>
          </div>
        )}
      </div>  
    </section>
    {user.id === currentUser.id && <UserAgenda userId={id} />}
    </>
  );
}

export default Profile;
