import React from 'react';
import SavedJobs from '../../components/User-side/SavedJobs';
import Navbar from '../../components/User-side/Navbar';
import Footer from '../../components/User-side/Footer';

const Saved = () => {
  return (
    <>
      <Navbar/>
      <SavedJobs/>
      <Footer/>
    </>
  );
}

export default Saved;
