import React, { Fragment } from 'react';
import Navbar from '../../components/Company-side/Navbar';
import JobPosting from '../../components/Company-side/JobPosting';

const JobScheduling = () => {
  return (
    <Fragment>
      <Navbar/>
      <JobPosting/>
    </Fragment>
  );
}

export default JobScheduling;
