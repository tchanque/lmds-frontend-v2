import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { bearerTokenAtom } from "../../atom/atoms";

function Profile() {
  const { id } = useParams();
  const [token] = useAtom(bearerTokenAtom);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axiosPrivate.get(`/users/${id}`, {
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

  if (loading) return <div>Chargement...</div>;
  if (!token) return <div>Vous n'êtes pas autorisé</div>;
  if (!user) return <div>Pas de profil correspondant</div>;

  return <div><h1>{user.first_name}</h1></div>;
}

export default Profile;