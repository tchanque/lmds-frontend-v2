import { useParams } from "react-router-dom"
import { axiosPrivate } from "../../api/axios"
import { useState } from "react";
import { useEffect } from "react";
import { bearerToken, currentUserAtom } from "../../atom/atoms";
import { useAtom } from "jotai";

function Profile () {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser] = useAtom(currentUserAtom);
  const [error, setError] = useState(null);
  const [token] = useAtom(bearerToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    axiosPrivate
    .get(`users/${id}`, { 
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      }, withCredentials: true,
    })
    .then((response) => {
      setUser(response.data)
      console.log(id)
      console.log(user)
    })
    .catch(error => {
      setError(error);
    });
  }, [id])





  if (!user) {
    return <div>No user data</div>
  }
  
  return (
    <div>
      <h1>Profile of {user.first_name} {user.last_name}</h1>
      <p>{user.email}</p>
      <p>{user.description}</p>
      <p>{user.role}</p>
      {currentUser.role === "Admin" || currentUser.id === user.id ? (
        <>
        <button>Update</button>
        <button>Delete</button>
        </>
      ) : <a>Non</a>}
    </div>
  )
}

export default Profile
