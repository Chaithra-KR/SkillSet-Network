import React from 'react';
import Navbar from '../../components/User-side/Navbar';
import Profile from '../../components/User-side/Profile';
import Footer from '../../components/User-side/Footer';

const UserProfile = () => {
  return (
    <div>
      <Navbar/>
      <Profile/>
      <Footer/>
    </div>
  );
}

export default UserProfile;
