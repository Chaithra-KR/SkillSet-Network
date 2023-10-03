import React, { useState,Fragment } from 'react';
import {useNavigate} from 'react-router-dom';

const SeekerOrCompany = () => {
  const [jobSeekerClicked, setJobSeekerClicked] = useState(false);
  const [companyClicked, setCompanyClicked] = useState(false);
  const [createButtonVisible, setCreateButtonVisible] = useState(true);
  const navigate = useNavigate()

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

  const handleCompanyAccess = () =>{
    navigate('/company/company-signUp')
  }

  const handleUserAccess = () =>{
    navigate('/signUp')
  }

  return (
    <Fragment>
    <div className="relative">
      <img src="trust.jpg" alt="Your Image" className="w-full" />
      <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className='bg-white bg-opacity-50 h-4/6 w-6/12 rounded'>
        <h1 className='text-white text-center pt-12' style={{ fontSize: '30px', fontFamily: 'cursive' }}>
          Join as a Job Seeker Or Company
        </h1>
        <div className='flex justify-between px-24 pt-20'>
          <button
            className={`bg-gray-100 w-56 h-40 p-2 border-gray-100 rounded shadow-md ${
              jobSeekerClicked ? 'bg-gray-200' : ''
            }`}
            onClick={handleJobSeekerClick}
          >
            {jobSeekerClicked ? '✔ Job Seeker' : "I'm a Job Seeker, Looking for a job!"}
          </button>
          <button
            className={`bg-gray-100 w-56 h-40 border-gray-100 rounded shadow-md ${
              companyClicked ? 'bg-gray-200' : ''
            }`}
            onClick={handleCompanyClick}
          >
            {companyClicked ? '✔ Company' : 'This is a company, Hiring workers!'}
          </button>
        </div>
        <div className='flex justify-center pt-14'>
          {createButtonVisible && (
            <button
              className={`hover: p-1 w-48 ml-5 border bg-gray-100 text-gray-400 rounded-full border-pink-400 shadow-md hover:bg-pink-100 cursor-not-allowed`}
              disabled={true}
            >
              Create Account
            </button>
          )}
          {jobSeekerClicked && (
            <button
              onClick={handleUserAccess} className={`p-1 w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
            >
              Apply as a Seeker
            </button>
          )}
          {companyClicked && (
            <button
              onClick={handleCompanyAccess} className={`p-1 w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
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
