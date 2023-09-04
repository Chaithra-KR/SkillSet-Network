import React from 'react';
import AdminSignIn from './components/Admin-side/Users';
import UserAccess from './components/User-side/UserAccess';
import Profile from './Utils/Company/EditCompanyProfile';
import UserProfile from './Utils/User/UserOtp';
import Starting from './Utils/Main/OTP';
import UserManagement from './Utils/Admin/UserManagement';


const App = () => {
  return (
    <div>
      <UserProfile/>
    </div>
  );
}

export default App;
