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
import { bearerToken, currentUserAtom } from "../../atom/atoms";
import { useEffect, useState } from "react";

const Nav = () => {
  const [token, setToken] = useAtom(bearerToken);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  
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
        setCurrentUser(null);
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
        {currentUser ? (
          <>
          <NavbarItem>
            <Link to={`users/${currentUser.id}`}>Mon Profil</Link>
          </NavbarItem>
          <NavbarItem>
            <Button onClick={logout}>Se déconnecter</Button>
          </NavbarItem>
          {currentUser.role === "Admin" && (
            <NavbarItem>
              <Link to="/admin">Dashboard Admin</Link>
            </NavbarItem>
        )}
        </>
      ) : (
        <>
          <NavbarItem>
            <Link to="/register">S'inscrire</Link>
            <Link to="/login">Se connecter</Link>
          </NavbarItem> 
          </>
        )}
        </NavbarContent>
    </Navbar>
  );
};

export default Nav;
