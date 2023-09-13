import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { seekerLogout } from '../../Store/storeSlices/seekerAuth';

const Navbar = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleHomeView = () =>{
    navigate('/home')
  }

  const handleProfileView = () =>{
    navigate('/my-profile')
  }

  const handleLogout = () =>{
    dispatch(seekerLogout())
    localStorage.removeItem('userInformation')
    navigate('/login')
  }

  return (
    <div className='h-16 w-full bg-white'>
      <div className='flex justify-between'>
          <div className='w-34 h-12 pt-2 pl-5 flex justify-center'>
          <img className='w-18 h-12' src="/skillset-logo.jpg" alt="" />
          </div>
          <div className='p-3.5'>
          <button onClick={handleHomeView} className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Home</button> 
          <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Job</button> 
          <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Messaging</button> 
          <button onClick={handleProfileView} className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Profile</button> 
          <button onClick={handleLogout} className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Logout</button> 
          <button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 shadow-md hover:bg-pink-400">Premium</button>

          </div>
      </div>
    </div>
  );
}

export default Navbar;
