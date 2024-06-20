import { useAtom } from "jotai";
import { axiosPrivate } from "../../api/axios";
import { userAtom, bearerTokenAtom } from "../../atom/atoms";

function LogoutButton() {
  const [, setUser] = useAtom(userAtom);
  const [, setToken] = useAtom(bearerTokenAtom);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosPrivate.delete("/users/sign_out", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);

      // Clear token from localStorage and atom
      localStorage.removeItem("token");
      setToken("");

      setUser({
        id: "",
        isLoggedIn: false,
        token: "",
      });

      console.log("You are logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
}

export default LogoutButton;
