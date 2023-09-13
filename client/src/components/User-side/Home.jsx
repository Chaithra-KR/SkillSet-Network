import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const seekerName = useSelector((state) => {return state.seekerDetails.seekerName});
  console.log(seekerName,'this is the home page redux');

  return (
    <div className='w-full h-screen bg-pink-100 flex justify-center items-center'>
      <h1 style={{ fontSize: '100px' }}>User's home page: {seekerName}</h1>
    </div>
  );
}

export default Home;

