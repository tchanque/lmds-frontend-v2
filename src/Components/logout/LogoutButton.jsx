import { useAtom } from "jotai";
import { userAtom } from "../../atom";
import Cookies from "js-cookie";
import { axiosPrivate } from "../../api/axios";

function LogoutButton() {
  const [, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    try {
      const response = await axiosPrivate.delete("/users/sign_out", {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
      console.log(response);

      setUser({
        id: "",
        isLoggedIn: false,
        token: "",
      });

      Cookies.remove("token");
      Cookies.remove("id");
      console.log("You are logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
}

export default LogoutButton;
