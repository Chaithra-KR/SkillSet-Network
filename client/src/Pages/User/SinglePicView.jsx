import React from 'react';
import Navbar from '../../components/User-side/Navbar';
import SinglePost from '../../components/User-side/SinglePostOfSeekers';
import Footer from '../../components/User-side/Footer';

const SinglePicView = () => {
  return (
    <>
      <Navbar/>
      <SinglePost/>
      <Footer/>
    </>
  );
}

export default SinglePicView;
