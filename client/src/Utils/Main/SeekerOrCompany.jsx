import React, { useState,Fragment } from 'react';
import Footer from '../../components/User-side/Footer';
import Navbar from '../../components/User-side/Navbar';


const SeekerOrCompany = () => {
  const [jobSeekerClicked, setJobSeekerClicked] = useState(false);
  const [companyClicked, setCompanyClicked] = useState(false);
  const [createButtonVisible, setCreateButtonVisible] = useState(true);

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

  return (
    <Fragment>
      <Navbar/>
    <div className='w-full h-screen bg-pink-100 flex justify-center items-center'>
      <div className='bg-white h-4/6 w-6/12'>
        <h1 className='text-black text-center pt-12' style={{ fontSize: '30px', fontFamily: 'cursive' }}>
          Join as a Job Seeker Or Company
        </h1>
        <div className='flex justify-between px-24 pt-20'>
          <button
            className={`bg-gray-100 w-56 h-40 p-2 border border-gray-100 shadow-md hover:border-pink-400 ${
              jobSeekerClicked ? 'bg-pink-200' : ''
            }`}
            onClick={handleJobSeekerClick}
          >
            {jobSeekerClicked ? '✔ Job Seeker' : "I'm a Job Seeker, Looking for a job!"}
          </button>
          <button
            className={`bg-gray-100 w-56 h-40 border border-gray-100 shadow-md hover:border-pink-400 ${
              companyClicked ? 'bg-pink-200' : ''
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
              className={`p-1 w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
            >
              Apply as a Seeker
            </button>
          )}
          {companyClicked && (
            <button
              className={`p-1 w-48 ml-5 border bg-pink-600 text-white rounded-full border-transparent shadow-md`}
            >
              Apply as a Company
            </button>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </Fragment>
  );
};

export default SeekerOrCompany;
