import React,{Fragment} from 'react';
import {Route,Routes} from 'react-router-dom';
import StartingHome from '../Utils/Main/StartingHome';
import SeekerOrCompany from '../Utils/Main/SeekerOrCompany';
import UserProfile from '../Utils/User/UserProfile';
import EditUserProfile from '../Utils/User/EditUserProfile';
import UserAccess from '../components/User-side/UserAccess';
import OTP from '../Utils/Main/OTP';
import UserHome from '../Utils/User/UserHome';

const User = () => {
    console.log("heoooo");
  return (
    <Fragment>
        <Routes>
            <Route path='/' element={<StartingHome/>}/>

            <Route path='/seek-Or-com' element={<SeekerOrCompany/>}/>

            <Route path='/Otp' element={<OTP/>}/>

            <Route path='/login' element={<UserAccess/>}/>

            <Route path='/signUp' element={<UserAccess/>}/>

            <Route path='/home' element={<UserHome/>}/>

            <Route path='/my-profile' element={<UserProfile/>}/>

            <Route path='/edit-myProfile' element={<EditUserProfile/>}/>

            <Route path='/logout' element={<StartingHome/>}/>

        </Routes>
        
    </Fragment>
  );
}

export default User;
