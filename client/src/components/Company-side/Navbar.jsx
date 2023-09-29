import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { companyLogout } from "../../Store/storeSlices/companyAuth";
import { FaBars, FaBell, FaHome, FaBriefcase, FaComment,FaUser } from "react-icons/fa";
import { Button, Modal } from "antd";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleProfileView = () => {
    navigate("/company/company-profile");
  };

  const handleJobView = () => {
    navigate("/company/company-Jobs");
  };

  const handleNotificationsView = () => {
    navigate("/company/notifications");
  };

  const handleHomeView = () => {
    navigate("/company/central-hub");
  };

  const handleLogout = () => {
    dispatch(companyLogout());
    localStorage.removeItem("companyInformation");
    navigate("/company/company-login");
  };

  const showModal = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className="h-16 w-full bg-white">
      <div className="flex justify-between">
        <div className="w-34 h-12 pt-2 pl-5 flex justify-center">
          <img className="w-18 h-12" src="/skillset-logo.jpg" alt="" />
        </div>
        <div className="p-3.5 md:hidden">
          <Button onClick={showModal}>
            <FaBars />
          </Button>
        </div>
        <Modal open={modalOpen} onCancel={handleCancel}>
          <div className="p-3.5 space-y-2">
            <button
              onClick={handleHomeView}
              className="p-1 border border-transparent rounded hover:bg-gray-50"
            >
              <FaHome className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleJobView}
              className="ml-2 p-1 border border-transparent rounded hover:bg-gray-50"
            >
              <FaBriefcase className="fill-current text-pink-500" />
            </button>
            <button className="p-1 border border-transparent rounded hover:bg-gray-50">
            <FaComment className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleProfileView}
              className="ml-2 p-1 border border-transparent rounded hover:bg-gray-50"
            >
              <FaUser className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleNotificationsView}
              className="ml-2 p-1 border border-transparent rounded hover:bg-gray-50"
            >
              <FaBell className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 p-1 border border-transparent rounded text-white px-2 bg-pink-400"
            >
              Logout
            </button>
          </div>
        </Modal>
        <div
          className={`p-3.5 space-x-2 md:space-x-5 lg:space-x-8 xl:space-x-10 md:flex ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <button
            onClick={handleHomeView}
            className=" border border-transparent rounded flex flex-col items-center"
          >
            <FaHome className="fill-current text-pink-500" />
            Home
          </button>

          <button
            onClick={handleJobView}
            className="pl-3 border border-transparent rounded flex flex-col items-center"
          >
            <FaBriefcase className="fill-current text-pink-500" />
            Jobs
          </button>

          <button
            className="pl-3 border border-transparent rounded flex flex-col items-center"
          >
            <FaComment className="fill-current text-pink-500" />
            Messaging
          </button>

          <button
            onClick={handleProfileView}
            className="pl-3 border border-transparent rounded flex flex-col items-center"
          >
            <FaUser className="fill-current text-pink-500" />
            Profile
          </button>
          
          <button
            onClick={handleNotificationsView}
            className="px-3 border border-transparent rounded flex flex-col items-center"
          >
            <FaBell className="fill-current text-pink-500" />
            Notifications
          </button>

          <button
            onClick={handleLogout}
            className="p-1 w-20 border border-transparent  text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
