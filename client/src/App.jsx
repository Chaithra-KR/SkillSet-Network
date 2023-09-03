import React from 'react';
import AdminSignIn from './components/Admin-side/SignIn';
import UserAccess from './components/User-side/UserAccess';
import CompanyAccess from './components/Company-side/CompanyAccess';
import UserProfile from './Utils/User/EditUserProfile';
import Profile from './Utils/Main/StartingHome';


const App = () => {
  return (
    <div>
      <Profile/>
    </div>
  );
}

export default App;
