import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './Pages/Home/Home'
import Agenda from './Pages/Agenda/Agenda'
import Profile from './Pages/Profile/Profile'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Nav from './Components/nav/Nav'
import Footer from './Components/footer/Footer'
import Terms from './Pages/Terms/Terms'
import Privacy from './Pages/Privacy/Privacy'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Nav />
        <Routes>
            <Route path="/" element={< Home/>} />
            <Route path="/agenda/:id" element={<Agenda/>} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
