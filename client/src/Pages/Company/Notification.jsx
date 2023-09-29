import React from 'react';
import Notifications from '../../components/Company-side/Notifications';
import Footer from '../../components/User-side/Footer';
import Navbar from '../../components/Company-side/Navbar';

const Notification = () => {
  return (
    <>
      <Navbar/>
      <Notifications/>
      <Footer/>
    </>
  );
}

export default Notification;
