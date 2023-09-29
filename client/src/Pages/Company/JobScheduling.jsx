import React, { Fragment } from 'react';
import Navbar from '../../components/Company-side/Navbar';  
import JobPosting from '../../components/Company-side/JobPosting';
import Footer from '../../components/User-side/Footer';

const JobScheduling = () => {
  return (
    <Fragment>
      <Navbar/>
      <JobPosting/>
      <Footer/>
    </Fragment>
  );
}

export default JobScheduling;
