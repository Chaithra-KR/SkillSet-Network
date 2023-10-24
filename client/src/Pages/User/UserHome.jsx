import React,{Fragment} from 'react';
import Navbar from '../../components/User-side/Navbar';
import Home from '../../components/User-side/Home';

const UserHome = () => {
  return (
    <Fragment>
      <Navbar/>
      <Home/>
    </Fragment>
  );
}

export default UserHome;
