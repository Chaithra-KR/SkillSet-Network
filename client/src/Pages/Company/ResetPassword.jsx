import React from 'react';
import Navbar from '../../components/Company-side/Navbar';
import ChangePassword from '../../components/Company-side/ChangePassword';
import Footer from '../../components/User-side/Footer';

const ResetPassword = () => {
  return (
    <>
      <Navbar/>
      <ChangePassword/>
      <Footer/>
    </>
  );
}

export default ResetPassword;
