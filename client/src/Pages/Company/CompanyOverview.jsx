import React from 'react';
import Navbar from '../../components/Company-side/Navbar';
import Overview from '../../components/Company-side/Overview';
import Footer from '../../components/User-side/Footer';

const CompanyOverview = () => {
  return (
    <>
      <Navbar/>
      <Overview/>
      <Footer/>
    </>
  );
}

export default CompanyOverview;
