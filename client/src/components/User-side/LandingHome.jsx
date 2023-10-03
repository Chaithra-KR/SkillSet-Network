import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingHome = () => {
  const [whySkillSet, setWhySkillSet] = useState(false);

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

  return (
    <div className="relative">
      <img src="trust.jpg" alt="Your Image" className="w-full" />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
        <div className="h-16 w-full">
          <div className="flex justify-between mt-2">
            <div className="w-34 h-12 pt-2 ml-8 flex justify-center">
              <img className="w-18 h-12" src="/skillSet-no-bg.png" alt="" />
            </div>
            <div className="p-3.5 text-lg text-white">
              <button
                onClick={handleHomeView}
                className="p-1 px-3 ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                Home
              </button>
              <button
                onClick={handleCompanyAccess}
                className="p-1 px-3 ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                For Companies
              </button>
              <button
                onClick={handleUserAccess}
                className="p-1 px-3 ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                For Seekers
              </button>
              <button
                onClick={handleWhySkillSetAccess}
                className="p-1 px-3 ml-5 border border-transparent rounded hover:bg-black hover:bg-opacity-40"
              >
                Why SkillSet
              </button>
              <button
                onClick={handleSeekOrCompany}
                className="p-1 ml-5 border border-transparent font-bold text-pink-400 rounded bg-white shadow-md hover:text-white hover:bg-black hover:bg-opacity-40"
              >
                Hello SignUp!
              </button>
            </div>
          </div>
        </div>
        <div className="text-white mono flex justify-center items-center h-96">
          <div>
            <p className="text-4xl pb-1">
              {" "}
              Here Companies and Talent Thrive Together ,{" "}
            </p>
            <p className="text-xl">
              Your Journey to Professional Success Begins Here and Now!
            </p>
            <div className="flex justify-center mr-8 pt-8">
              <button
                onClick={handleSeekOrCompany}
                className="px-3 py-2 border border-transparent font-bold text-pink-400 rounded-full bg-white shadow-md hover:text-white hover:bg-black hover:bg-opacity-40"
              >
                Hello SignUp!
              </button>
            </div>
          </div>
        </div>
        <div className="h-96 flex mt-10 justify-center">
        {whySkillSet ? <div className="text-xl text-white">
            <p className="font-bold pb-1">Why SkillSet Network ?</p>
            <p>SkillSet Network is a professional social networking platform</p> 
            <p>designed for job findings and individuals to connect and interact</p>
            <p> in a companies or professional context.</p> </div> : null}
        </div>
      </div>
    </div>
  );
};

export default LandingHome;
