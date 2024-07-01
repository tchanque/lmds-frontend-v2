import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { useAtom } from "jotai";
import { currentUserAtom } from "./atom/atoms";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Nav from "./Components/nav/Nav";
import Footer from "./Components/footer/Footer";
import Cgu from "./Pages/Cgu/Cgu";
import Mentions from "./Pages/Mentions/Mentions";
import DashboardAdmin from "./Pages/Dashboard Admin/DashboardAdmin";
import { useEffect } from "react";

function App() {
  const [currentUser] = useAtom(currentUserAtom);

  const isAdmin = () => {
    return currentUser && currentUser.role === "Admin";
  };

  useEffect(() => {
    if (!sessionStorage.getItem('AppOpened')) {
      localStorage.clear();
      sessionStorage.setItem('AppOpened', 'true');
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:id" element={<Profile />} />
          <Route
            path="/profile"
            element={
              currentUser ? (
                <Navigate to={`users/${currentUser.id}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {isAdmin() ? (
            <Route path="/admin" element={<DashboardAdmin />} />
          ) : (
            <Route path="/admin" element={<Navigate to="/" replace />} />
          )}
          <Route path="/CGU" element={<Cgu />} />
          <Route path="/Mentions" element={<Mentions />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
