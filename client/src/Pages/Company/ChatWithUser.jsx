import React from 'react';
import Navbar from '../../components/Company-side/Navbar';
import Chat from '../../components/Company-side/Chat';
import Footer from '../../components/User-side/Footer';

const ChatWithUser = () => {
  return (
    <>
      <Navbar/>
      <Chat/>
      <Footer/>
    </>
  );
}

export default ChatWithUser;
