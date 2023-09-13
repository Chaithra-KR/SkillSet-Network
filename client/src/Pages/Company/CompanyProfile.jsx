import React,{Fragment} from 'react';
import Profile from '../../components/Company-side/Profile';
import Navbar from '../../components/Company-side/Navbar';
import Footer from '../../components/User-side/Footer';

const CompanyProfile = () => {
  return (
    <Fragment>
        <Navbar/>
        <Profile/>
        <Footer/>
    </Fragment>
  );
}

export default CompanyProfile;
