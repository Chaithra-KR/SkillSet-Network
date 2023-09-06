import React,{Fragment} from 'react';
import Navbar from '../../components/User-side/Navbar';
import Home from '../../components/User-side/Home';
import Footer from '../../components/User-side/Footer';

const UserHome = () => {
  return (
    <Fragment>
      <Navbar/>
      <Home/>
      <Footer/>
    </Fragment>
  );
}

export default UserHome;
