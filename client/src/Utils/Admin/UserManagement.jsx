import React,{Fragment} from 'react';
import Navbar from '../../components/Admin-side/Navbar';
import Users from '../../components/Admin-side/Users';

const UserManagement = () => {
  return (
    <Fragment>
        <Navbar/>
        <Users/>
    </Fragment>
  );
}

export default UserManagement;
