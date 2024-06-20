import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { bearerTokenAtom } from "../../atom/atoms";
import { useAtom } from "jotai";

function Profile() {
  const { id } = useParams();
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [user, setUser] = useState(null);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    console.log(storedToken);
    axiosPrivate
      .get(`/users/${id}`, {
        headers: {
          Authorization: `${storedToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setUser(response.data.user)
      });
  }, []);

  if (!storedToken) {
    return (
      <div>Vous n'êtes pas autorisé</div>
    )
  }

  if (!user) {
    return (
      <div>Pas de profil correspondant</div>
    )
  }

  return (
    <div>
      <h1>{user.first_name}</h1>
    </div>
  );
}

export default Profile;
