import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

const SeekerOrCompany = () => {
  const [jobSeekerClicked, setJobSeekerClicked] = useState(false);
  const [companyClicked, setCompanyClicked] = useState(false);
  const [createButtonVisible, setCreateButtonVisible] = useState(true);
  const navigate = useNavigate();

  const handleJobSeekerClick = () => {
    setJobSeekerClicked(!jobSeekerClicked);
    setCompanyClicked(false);
    setCreateButtonVisible(false);
  };

  const handleCompanyClick = () => {
    setCompanyClicked(!companyClicked);
    setJobSeekerClicked(false);
    setCreateButtonVisible(false);
  };

  const handleCompanyAccess = () => {
    navigate("/company/company-signUp");
  };

  const handleUserAccess = () => {
    navigate("/signUp");
  };

  return (
    <Fragment>
      <div className="relative">
        <img src="trust.jpg" alt="Your Image" className="w-full" />
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white bg-opacity-50 h-4/6 md:h-4/6 lg:w-6/12 xl:w-5/12 rounded mx-5">
            <h1 className="text-white text-center pt-4 lg:pt-12 font-bold text-2xl md:text-3xl lg:text-3xl ">
              Join as a Job Seeker Or Company
            </h1>
            <div className="flex flex-col md:flex-row mt-7 justify-between px-5 md:px-10 lg:px-20 pt-8 md:pt-20">
              <button
                className={`bg-gray-100 w-full md:w-56 h-40 p-2 md:mr-2 border-gray-100 rounded shadow-md ${
                  jobSeekerClicked ? "bg-gray-200" : ""
                }`}
                onClick={handleJobSeekerClick}
              >
                {jobSeekerClicked
                  ? "✔ Job Seeker"
                  : "I'm a Job Seeker, Looking for a job!"}
              </button>
              <button
                className={`bg-gray-100 w-full md:w-56 h-40 md:ml-2 mt-4 md:mt-0 border-gray-100 rounded shadow-md ${
                  companyClicked ? "bg-gray-200" : ""
                }`}
                onClick={handleCompanyClick}
              >
                {companyClicked
                  ? "✔ Company"
                  : "This is a company, Hiring workers!"}
              </button>
            </div>
            <div className="flex justify-center pt-8 pr-4">
              {createButtonVisible && (
                <button
                  className={`hover:p-1 w-full md:w-48 ml-5 border py-2 bg-gray-100 text-gray-400 rounded-full border-pink-400 shadow-md hover:bg-pink-100 cursor-not-allowed`}
                  disabled={true}
                >
                  Create Account
                </button>
              )}
              {jobSeekerClicked && (
                <button
                  onClick={handleUserAccess}
                  className={`p-1 w-full md:w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
                >
                  Apply as a Seeker
                </button>
              )}
              {companyClicked && (
                <button
                  onClick={handleCompanyAccess}
                  className={`p-1 w-full md:w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
                >
                  Apply as a Company
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SeekerOrCompany;
