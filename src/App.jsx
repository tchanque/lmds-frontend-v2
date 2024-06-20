import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { useAtom } from 'jotai';
import { currentUserAtom } from './atom/atoms';
import Home from './Pages/Home/Home'
import Agenda from './Pages/Agenda/Agenda'
import Profile from './Pages/Profile/Profile'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Nav from './Components/nav/Nav'
import Footer from './Components/footer/Footer'
import Terms from './Pages/Terms/Terms'
import Privacy from './Pages/Privacy/Privacy'
import DashboardAdmin from './Pages/Dashboard Admin/DashboardAdmin'

function App() {
  const [currentUser] = useAtom(currentUserAtom);

  const isAdmin = () => {
    return currentUser && currentUser.role === "Admin";
  };

  return (
    <>
      <BrowserRouter>
      <Nav />
        <Routes>
            <Route path="/" element={< Home/>} />
            <Route path="/agenda/:id" element={<Agenda/>} />
            <Route path="/users/:id" element={<Profile />} />
              <Route path='/profile' element={currentUser ? <Navigate to={`users/${currentUser.id}`} replace/> : <Navigate to="/login" replace/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy/>} />
            {isAdmin() ? (
              <Route path="/admin" element={<DashboardAdmin/>}/>
            ) : (
              <Route path="/admin" element={<Navigate to="/" replace />}
            />
            )}
            
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
