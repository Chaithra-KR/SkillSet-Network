import React,{Fragment} from 'react';
import Navbar from '../../components/Company-side/Navbar';
import Home from '../../components/Company-side/Home';
import Footer from '../../components/User-side/Footer';

const CentralHub = () => {
  return (
    <Fragment>
      <Navbar/>
      <Home/>
      <Footer/>
    </Fragment>
  );
}

export default CentralHub;
