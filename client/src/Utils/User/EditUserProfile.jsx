import React from 'react';
import Navbar from '../../components/User-side/Navbar';
import EditProfile from '../../components/User-side/EditProfile';
import Footer from '../../components/User-side/Footer';

const EditUserProfile = () => {
  return (
    <div>
      <Navbar/>
      <EditProfile/>
      <Footer/>
    </div>
  );
}

export default EditUserProfile;
