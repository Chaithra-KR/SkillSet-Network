import React,{Fragment} from 'react';
import Navbar from '../../components/Company-side/Navbar';
import EditProfile from '../../components/Company-side/EditProfile';
import Footer from '../../components/User-side/Footer';

const EditCompanyProfile = () => {
  return (
    <Fragment>
        <Navbar/>
        <EditProfile/>
        <Footer/>
    </Fragment>
  );
}

export default EditCompanyProfile;
