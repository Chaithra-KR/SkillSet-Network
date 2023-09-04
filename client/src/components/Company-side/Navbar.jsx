import React from 'react';

const Navbar = () => {
  return (
        <div className='h-16 w-full bg-white'>
            <div className='flex justify-between'>
                <div className='w-34 h-12 pt-2 pl-5 flex justify-center'>
                <img className='w-18 h-12' src="/skillset logo.jpg" alt="" />
                </div>
                <div className='p-3.5'>
                <button className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Home</button> 
                <button className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Job</button> 
                <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Messaging</button> 
                <button className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Profile</button> 
                <button className="p-1 ml-5 border border-transparent rounded hover:bg-gray-50">Notifications</button>
                </div>
            </div>
        </div>
  );
}

export default Navbar;
