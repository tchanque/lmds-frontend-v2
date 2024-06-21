import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import avatar from "../../public/images/profile_picture.jpeg";

// "../public/images/profile_picture.jpeg"
import "./profile.css";

function Profile() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom);
  const [token] = useAtom(bearerTokenAtom);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <section>
      <div className="title">
        {user.id === currentUser.id ? (
          <h1>MON COMPTE</h1>
        ) : (
          <h1>PROFIL MUSICIEN</h1>
        )}
      </div>
      <div className="userProfileDetails">
        <div className="mainInformationSection">
          <div>
            <img src={avatar} alt="Logo" />
          </div>
          <div>
            <p>
              {user.first_name} {user.last_name}
            </p>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="secondaryInformationSection">
          <div className="instrumentSection">
            <div>
              <p>Piano</p>
              <p>Niveau 3</p>
            </div>
            <div>
              <p>Guitare</p>
              <p>Niveau 4</p>
            </div>
          </div>
          <div className="description">
            <p>{user.description}</p>
          </div>
          <div className="passwordSection">
            <h4>Changer mon mot de passe</h4>
            <input type="text" placeholder="Ancien mot de passe" />
            <input type="text" placeholder="Nouveau mot de passe" />
            <input type="text" placeholder="Confirmer nouveau mot de passe" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
