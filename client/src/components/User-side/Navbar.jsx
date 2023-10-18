import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { seekerLogout } from "../../Store/storeSlices/seekerAuth";
import { Button, Modal } from "antd";
import {
  FaBars,
  FaHome,
  FaBriefcase,
  FaComment,
  FaUser,
  FaCog,
  FaImage,
} from "react-icons/fa";
import { UserApi } from "../../configs/api";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenForSettings, setModalOpenForSettings] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHomeView = () => {
    navigate("/home");
  };

  const handleProfileView = () => {
    navigate("/my-profile");
  };

  const handleMessageView = () => {
    navigate("/chat-with-company");
  };

  const handleLogout = () => {
    dispatch(seekerLogout());
    localStorage.removeItem("userInformation");
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleJobView = () => {
    navigate("/jobView");
  };

  const showModal = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handlePotsView = () => {
    if (userDetails.premiumStatus === true) {
      navigate("/posts");
    } else {
      navigate("/upgrade-premium");
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpenForSettings(true);
  };

  const closeModal = () => {
    setModalOpenForSettings(false);
  };

  const seeker = useSelector((state) => state?.seekerDetails.seekerToken);

  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        const res = await axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(seeker)}`
        );
        setUserDetails(res.data.seekerData);
      } catch (error) {
        console.error(error);
      }
    };
    handleJobDetails();
  }, [seeker]);

  return (
    <div className="h-16 w-full bg-white">
      <div className="flex justify-between">
        <div className="w-34 h-12 pt-2 pl-5 flex justify-center">
          <img className="w-18 h-12" src="/skillset-logo.jpg" alt="" />
        </div>
    {console.log(userDetails.premiumStatus)}

        <div className="p-3.5 md:hidden">
          <Button onClick={showModal}>
            <FaBars />
          </Button>
        </div>
        <Modal open={modalOpen} footer={null} onCancel={handleCancel}>
          <div className="p-3.5 space-y-2">
            <button
              onClick={handleHomeView}
              className="p-1 border border-transparent rounded hover:bg-gray-50"
            >
              <FaHome className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleJobView}
              className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
            >
              <FaBriefcase className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handlePotsView}
              className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
            >
              <FaImage className="fill-current text-pink-500" />
            </button>
            <button className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50">
              <FaComment className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleProfileView}
              className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
            >
              <FaUser className="fill-current text-pink-500" />
            </button>
            <button
              onClick={handleLogout}
              className="p-1 ml-4 border border-transparent text-white px-2 rounded bg-pink-400"
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
            className="px-5 border border-transparent rounded flex flex-col items-center"
          >
            <FaBriefcase className="fill-current text-pink-500" />
            Jobs
          </button>

          <button
            onClick={handlePotsView}
            className=" border border-transparent rounded flex flex-col items-center"
          >
            <FaImage className="fill-current text-pink-500" />
            Posts
          </button>

          <button
            onClick={handleMessageView}
            className="pl-5 border border-transparent rounded flex flex-col items-center"
          >
            <FaComment className="fill-current text-pink-500" />
            Messaging
          </button>

          <button
            onClick={handleProfileView}
            className="px-5 border border-transparent rounded flex flex-col items-center"
          >
            <FaUser className="fill-current text-pink-500" />
            Profile
          </button>

          <button
            onClick={openModal}
            className="px-3 border border-transparent rounded flex flex-col items-center"
          >
            <FaCog className="fill-current text-pink-500" />
            Settings
          </button>
          <Modal
            open={modalOpenForSettings}
            onCancel={closeModal}
            footer={null}
          >
            <div className="flex justify-center items-center">
              <div className="flex flex-col">
                <button
                  onClick={handleChangePassword}
                  className="p-1  mb-2 w-40 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
                >
                  Change password
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 ml-7 w-24 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
                >
                  Logout
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
