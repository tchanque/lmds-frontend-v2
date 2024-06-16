import { Link } from "react-router-dom/dist";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";


const Nav = () => {

  return (
    <Navbar>
      <NavbarBrand>
        
      </NavbarBrand>
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
          <Link to="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button >
          <Link to="/register">Se connecter</Link>
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Nav