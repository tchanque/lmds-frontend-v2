import { useAtom } from "jotai";
import { axiosPrivate } from "../../api/axios";
import { currentUserAtom, bearerTokenAtom } from "../../atom/atoms";
import {Button} from "@nextui-org/react";

function LogoutButton() {
  const [, setUser] = useAtom(currentUserAtom);
  const [token, setToken] = useAtom(bearerTokenAtom);

  const handleLogout = async () => {
    try {
      const response = await axiosPrivate.delete("/users/sign_out", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      console.log(response.data);
      console.log("You are logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <Button onClick={handleLogout} className="w-full p-0 m-0 font-bold text-white bg-danger-main">DÉCONNEXION</Button>;
}

export default LogoutButton;
