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
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useEffect, useState } from "react";
import LogoutButton from "../logout/LogoutButton";

const Nav = () => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);


  return (
    <Navbar>
      <NavbarBrand></NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
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
              <Link to={`users/${currentUser.id}`}>{currentUser.first_name} {currentUser.last_name}</Link>
            </NavbarItem>
            <NavbarItem>
              <LogoutButton></LogoutButton>
            </NavbarItem>
            {currentUser.role === "Admin" && (
              <NavbarItem>
                <Link to="/admin">Dashboard Admin</Link>
              </NavbarItem>
            )}
          </>
        ) : (
          <NavbarItem>
            <Link to="/register">S'inscrire</Link>
            <Link to="/login">Se connecter</Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
