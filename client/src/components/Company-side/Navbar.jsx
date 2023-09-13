import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { companyLogout } from '../../Store/storeSlices/companyAuth';

const Navbar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleProfileView = () =>{
    navigate('/company/company-profile')
  }

  const handleJobView = () =>{
    navigate('/company/company-Jobs')
  }

  const handleHomeView = () =>{
    navigate('/company/central-hub')
  }

  const handleLogout = () =>{
    dispatch(companyLogout())
    localStorage.removeItem('companyInformation')
    navigate('/company/company-login')
  }

  return (
        <div className='h-16 w-full bg-white'>
            <div className='flex justify-between'>
                <div className='w-34 h-12 pt-2 pl-5 flex justify-center'>
                <img className='w-18 h-12' src="/skillset-logo.jpg" alt="" />
                </div>
                <div className='p-3.5'>
                <button onClick={handleHomeView} className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Home</button> 
                <button onClick={handleJobView} className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Job</button> 
                <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Messaging</button> 
                <button onClick={handleProfileView} className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Profile</button> 
                <button className="p-1 ml-5 border border-transparent rounded hover:bg-gray-50">Notifications</button>
                <button onClick={handleLogout}  className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 shadow-md hover:bg-pink-400">Logout</button>
                </div>
            </div>
        </div>
  );
}

export default Navbar;
