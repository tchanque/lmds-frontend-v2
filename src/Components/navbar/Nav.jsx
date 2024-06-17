import { Link } from "react-router-dom/dist";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { axiosPrivate } from "../../api/axios";
import { useAtom } from "jotai";
import { bearerToken } from "../../atom/atoms";

const Nav = () => {
  const [token, setToken] = useAtom(bearerToken);

  const logout = () => {
    console.log(token)
    axiosPrivate
      .delete("/users/sign_out", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        console.log(response)
        setToken(null);
      })
      .catch(error => {
        console.error('Logout failed:', error);
      })
  };

  return (
    <Navbar>
      <NavbarBrand></NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/agenda">Agenda</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link to="/login">Se connecter</Link>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={logout}>Se déconnecter</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
