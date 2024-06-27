import { Link } from "react-router-dom/dist";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { axiosPrivate } from "../../api/axios";
import { useAtom } from "jotai";
import { bearerTokenAtom, currentUserAtom } from "../../atom/atoms";
import { useEffect, useState } from "react";
import LogoutButton from "../logout/LogoutButton";
import logoNav from "../../public/images/branding/logo_lmds-1.png";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
const Nav = () => {
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return (
    <Navbar>
       <NavbarBrand>
        <img src={logoNav} className="w-28" />
      </NavbarBrand>
      <NavbarContent justify="center" className="hidden gap-5 g-5 sm:flex">
        <NavbarItem>
          <Link to="/">
            <p className="font-bold text-primary-dark">HOME</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <a href="#events">
            <p className="font-bold text-primary-dark">ÉVÈNEMENTS</p>
          </a>
        </NavbarItem>
      </NavbarContent>
        {currentUser ? (
          <>
          <NavbarContent justify="center" className="hidden gap-10 g-5 sm:flex">
            <NavbarItem>
              <Link to={{ pathname: `users/${currentUser.id}`, hash: "agenda " }}>
                <p className="font-bold text-primary-dark">AGENDA</p>
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button variant="bordered">
                    <p className="font-bold text-primary-main">
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu aria-label="">
                <DropdownItem textValue="profil" key="profil" className="text-center">
                  <Link to={`users/${currentUser.id}`}>
                    <p className="font-bold text-primary-dark">MON PROFIL</p>
                  </Link>
                </DropdownItem>
                {currentUser.role === "Admin" && (
                  <DropdownItem textValue="admin" key="admin" className="text-center">
                    <Link to="/admin">
                      <p className="font-bold text-primary-dark">PANNEAU ADMIN</p>
                    </Link>
                  </DropdownItem>
                )}
                <DropdownItem textValue="logout" key="logout" className="p-0 text-center">
                  <LogoutButton />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </>
        ) : (
<NavbarContent justify="end">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button variant="bordered">Se connecter</Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="Example with disabled actions" disabledKeys={["edit", "delete"]}>
              <DropdownItem textValue="register" key="register">
                <Link to="/register">S'inscrire</Link>
              </DropdownItem>
              <DropdownItem textValue="Login" key="login">
                <Link to="/login">Se connecter</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </Navbar>
  );
};

export default Nav;
