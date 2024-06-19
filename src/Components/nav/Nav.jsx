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
import { useEffect, useState } from "react";

const Nav = () => {
  const [token, setToken] = useAtom(bearerToken);
  const [currentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    if (token) {
      setCurrentUser(true);
    } else {
      setCurrentUser(false);
    }
  }, [token])

  const logout = () => {
    console.log(token)
    axiosPrivate
      .delete("/users/sign_out", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        }, withCredentials: true,
      })
      .then((response) => {
        console.log(response)
        setToken(null);
        setCurrentUser(false);
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
        <NavbarItem>
          <Link to="/register">S'inscrire</Link>
        </NavbarItem>
        {currentUser ? (
          <NavbarItem>
          <Button onClick={logout}>Se déconnecter</Button>
        </NavbarItem>
        ) : (
          <NavbarItem className="hidden lg:flex">
          <Link to="/login">Se connecter</Link>
        </NavbarItem>
        )}       
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
