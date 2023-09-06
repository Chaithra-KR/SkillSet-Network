import React,{Fragment} from 'react';
import {Route,Routes} from 'react-router-dom';
import UserManagement from '../Utils/Admin/UserManagement';
import CompanyManagement from '../Utils/Admin/companyManagement';
import SignIn from '../components/Admin-side/SignIn';
import Dashboard from '../Utils/Admin/Dashboard';

const Admin = () => {
  return (
    <Fragment>
      <Routes>

            <Route path='/admin-login' element={<SignIn/>}/>

            <Route path='/dashboard' element={<Dashboard/>}/>

            <Route path='/user-management' element={<UserManagement/>}/>

            <Route path='/companies-management' element={<CompanyManagement/>}/>

            <Route path='/admin-logout' element={<SignIn/>}/>


        </Routes>
    </Fragment>
  );
}

export default Admin;
