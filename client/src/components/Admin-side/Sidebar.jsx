import React from 'react';
import {useNavigate} from 'react-router-dom';

const Sidebar = () => {

    const navigate = useNavigate()

    const handleUsersView = (()=>{
        navigate('/admin/user-management')
    }) 

    const handleDashboardView = (()=>{
        navigate('/admin/dashboard')
    }) 

    const handleCompaniesView = (()=>{
        navigate('/admin/companies-management')
    }) 

    const handleLogout = (()=>{
        navigate('/admin/admin-logout')
    }) 


  return (
    <div className="w-2/12 bg-white p-4 text-white text-xl">
          <div className="ml-7 mb-4">
            <button onClick={handleDashboardView} className="bg-gray-50 w-44 hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Dashboard</button>
          </div>
          <div className="ml-7 mb-4">
            <button onClick={handleUsersView} className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Users</button>
          </div>
          <div className="ml-7 mb-4">
            <button onClick={handleCompaniesView} className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Companies</button>
          </div>
          <div className="ml-7 mb-4">
            <button className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Accounts</button>
          </div>
          <div className="ml-7 mb-4">
            <button onClick={handleLogout} className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">SignOut</button>
          </div>
        </div>
  );
}

export default Sidebar;
