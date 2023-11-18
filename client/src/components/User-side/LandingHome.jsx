import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import {
  FaBars,
  FaHome,
  FaBriefcase,
  FaComment,
  FaUser,
  FaUsers,
  FaRegBuilding,
} from "react-icons/fa";

const LandingHome = () => {
  const [whySkillSet, setWhySkillSet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleWhySkillSetAccess = () => {
    setWhySkillSet(true);
  };

  const navigate = useNavigate();

  const handleSeekOrCompany = () => {
    navigate("/seek-Or-com");
  };

  const handleHomeView = () => {
    setWhySkillSet(false);
    navigate("/");
  };

  const handleCompanyAccess = () => {
    navigate("/company/company-signUp");
  };

  const handleUserAccess = () => {
    navigate("/signUp");
  };

  const showModal = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className="relative">
      <img src="trust.jpg" alt="Your Image" className="w-full" />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
        <div className="h-16 w-full">
          <div className="flex justify-between mt-2">
            <div className="w-34 h-12 pt-2 ml-4 sm:ml-8 md:ml-12 lg:ml-20 xl:ml-24 flex justify-center">
              <img className="w-18 h-12" src="/skillSet-no-bg.png" alt="" />
            </div>

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
                  onClick={handleCompanyAccess}
                  className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
                >
                  <FaRegBuilding className="fill-current text-pink-500" />
                </button>
                <button
                  onClick={handleUserAccess}
                  className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
                >
                  <FaUsers className="fill-current text-pink-500" />
                </button>

                <button
                  onClick={handleSeekOrCompany}
                  className="p-1 pl-2 border border-transparent rounded hover:bg-gray-50"
                >
                  <FaUser className="fill-current text-pink-500" />
                </button>
              </div>
            </Modal>
            <div
              className={`p-3.5 space-x-2 md:space-x-5 lg:space-x-8 xl:space-x-10 text-white md:flex ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              <button
                onClick={handleHomeView}
                className="p-1 px-3 ml-2 sm:ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                Home
              </button>
              <button
                onClick={handleCompanyAccess}
                className="p-1 px-3 ml-2 sm:ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                For Companies
              </button>

              <button
                onClick={handleUserAccess}
                className="p-1 px-3 ml-2 sm:ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                For Seekers
              </button>
              <button
                onClick={handleWhySkillSetAccess}
                className="p-1 px-3 ml-2 sm:ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                Why SkillSet
              </button>

              <button
                onClick={handleSeekOrCompany}
                className="p-1 ml-2 sm:ml-5 border border-transparent font-bold text-pink-400 rounded bg-white shadow-md hover:text-white hover:bg-black hover:bg-opacity-40"
              >
                Hello SignUp!
              </button>
            </div>
          </div>
        </div>
        <div className="text-white mono flex justify-center items-center sm:h-96 md:h-80 lg:h-96 xl:h-96">
          <div>
            <p className="text-lg sm:text-4xl pb-1">
              {" "}
              Here Companies and Talent Thrive Together ,{" "}
            </p>
            <p className="text-sm sm:text-xl">
              Your Journey to Professional Success Begins Here!
            </p>
            <div className="sm:flex justify-center mr-8 hidden sm:pt-8">
              <button
                onClick={handleSeekOrCompany}
                className="px-3 py-2 border border-transparent font-bold text-pink-400 rounded-full bg-white shadow-md hover:text-white hover:bg-black hover:bg-opacity-40"
              >
                Hello SignUp!
              </button>
            </div>
          </div>
        </div>
        <div className="h-96 flex mt-0 sm:mt-10 justify-center ">
          {whySkillSet ? (
            <div className="text-xl text-white">
              <p className="font-bold pb-1">Why SkillSet Network ?</p>
              <p>
                SkillSet Network is a professional social networking platform
              </p>
              <p>
                designed for job findings and individuals to connect and
                interact
              </p>
              <p> in a companies or professional context.</p>{" "}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LandingHome;
