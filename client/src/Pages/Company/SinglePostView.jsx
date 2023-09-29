import React from 'react';
import SinglePost from '../../components/Company-side/SinglePost';
import Navbar from '../../components/Company-side/Navbar';
import Footer from '../../components/User-side/Footer';

const SinglePostView = () => {
  return (
    <>
      <Navbar/>
      <SinglePost/>
      <Footer/>
    </>
  );
}

export default SinglePostView;
