import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { seekerLogout } from '../../Store/storeSlices/seekerAuth';
import { FaBars } from 'react-icons/fa'; // Import the menu icon from React Icons
import { Button, Modal } from 'antd'; // Import your modal components and Button component

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false); // State to control the menu open/close
  const [modalOpen, setModalOpen] = useState(false); // State to control the modal open/close

  const handleHomeView = () => {
    navigate('/home');
  };

  const handleProfileView = () => {
    navigate('/my-profile');
  };

  const handleLogout = () => {
    dispatch(seekerLogout());
    localStorage.removeItem('userInformation');
    navigate('/login');
  };

  const handleJobView = () => {
    navigate('/jobView');
  };

  const showModal = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className='h-16 w-full bg-white'>
      <div className='flex justify-between'>
        <div className='w-34 h-12 pt-2 pl-5 flex justify-center'>
          <img className='w-18 h-12' src='/skillset-logo.jpg' alt='' />
        </div>
        <div className='p-3.5 md:hidden'>
          <Button onClick={showModal}>
            <FaBars />
          </Button>
        </div>
        <Modal open={modalOpen} onCancel={handleCancel}>
          <div className='p-3.5 space-y-2'>
            <button onClick={handleHomeView} className='p-1 border border-transparent rounded hover:bg-gray-50'>
              Home
            </button>
            <button onClick={handleJobView} className='p-1 border border-transparent rounded hover:bg-gray-50'>
              Job
            </button>
            <button className='p-1 border border-transparent rounded hover:bg-gray-50'>Messaging</button>
            <button onClick={handleProfileView} className='p-1 border border-transparent rounded hover:bg-gray-50'>
              Profile
            </button>
            <button onClick={handleLogout} className='p-1 border border-transparent rounded hover:bg-gray-50'>
              Logout
            </button>
            <button className='p-1 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400'>
              Premium
            </button>
          </div>
        </Modal>
        <div className={`p-3.5 space-x-2 md:space-x-5 lg:space-x-8 xl:space-x-10 md:flex ${menuOpen ? 'block' : 'hidden'}`}>
          {/* These buttons are displayed in the menu */}
          <button onClick={handleHomeView} className='p-1 border border-transparent rounded hover:bg-gray-50'>
            Home
          </button>
          <button onClick={handleJobView} className='p-1 border border-transparent rounded hover:bg-gray-50'>
            Job
          </button>
          <button className='p-1 border border-transparent rounded hover:bg-gray-50'>Messaging</button>
          <button onClick={handleProfileView} className='p-1 w-20 border border-transparent rounded hover:bg-gray-50'>
            Profile
          </button>
          <button onClick={handleLogout} className='p-1 w-20 border border-transparent rounded hover:bg-gray-50'>
            Logout
          </button>
          <button className='p-1 w-20 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400'>
            Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
