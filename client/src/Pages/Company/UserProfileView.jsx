import React from 'react';
import Navbar from '../../components/Company-side/Navbar';
import UserView from '../../components/Company-side/UserView';
import { Footer } from 'antd/es/layout/layout';

const UserProfileView = () => {
  return (
    <>
      <Navbar/>
      <UserView/>
      <Footer/>
    </>
  );
}

export default UserProfileView;
