import { useState } from "react";
import { useAtom } from "jotai";
import { popUpAdminFormAtom } from "../../atom/atoms";
import UsersAdminDashboard from "../../Components/admin/UsersAdminDashboard/UsersAdminDashboard";
import AdminRegistrationForm from "../../Components/admin/registration_form/AdminRegistrationForm";
import PublicationsAdminDashboard from "../../Components/admin/PublicationsAdminDashboard/PublicationsAdminDashboard";
import EventsAdminDashboard from "../../Components/admin/EventsAdminDashboard/EventsAdminDashboard";



const DashboardAdmin = () => {
  const [popUpAdminForm, setPopUpAdminForm] = useAtom(popUpAdminFormAtom);
  const [showUsersList, setShowUsersList] = useState(true);
  const [showPublicationsList, setShowPublicationsList] = useState(false);
  const [showEventsList, setShowEventsList]= useState(false);

  const handleUsersList = () => {
    setShowUsersList(true);
    setShowPublicationsList(false);
    setShowEventsList(false);
  }

  const handlePublicationsList = () => {
    setShowUsersList(false);
    setShowPublicationsList(true);
    setShowEventsList(false);
  }

  const handleEventsList = () => {
    setShowUsersList(false);
    setShowPublicationsList(false);
    setShowEventsList(true);
  }

  return (
    <>
      <div className="flex">
        <div>
          <aside className="flex flex-col items-center">
            <img
              src="https://i.ibb.co/9tWD7Q7/LOGO-DM-removebg-preview.png"
              alt="logo de la maison des sons"
            />
            <ul>
              <li className="flex justify-center">
                <button onClick={handleUsersList}>Users List</button>
              </li>
              <li className="flex justify-center">
                <button onClick={handlePublicationsList}>Publications List</button>
              </li>
              <li className="flex justify-center">
                <button onClick={handleEventsList}>Events List</button>
              </li>
            </ul>
          </aside>
        </div>
        <div className="w-full mr-5">
          {showUsersList && <UsersAdminDashboard />}
          {showPublicationsList && <PublicationsAdminDashboard />}
          {showEventsList && <EventsAdminDashboard />}
        </div>
      </div>
      {popUpAdminForm && <AdminRegistrationForm />}
    </>
  );
};

export default DashboardAdmin;
