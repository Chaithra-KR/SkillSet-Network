import React from 'react';
import Navbar from '../../components/User-side/Navbar';
import SinglePostView from '../../components/User-side/SinglePostView';
import Footer from '../../components/User-side/Footer';

const SinglePost = () => {
  return (
    <>
      <Navbar/>
      <SinglePostView/>
      <Footer/>
    </>
  );    
}

export default SinglePost;
