import React from 'react';

const Navbar = () => {
  return (
    <div className='h-16 w-full bg-white'>
        <div className='p-3.5 flex justify-end'>
        <button className="p-1 w-20 ml-5 border rounded border-transparent hover:bg-gray-50">Home</button> 
        <button className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Job</button> 
        <button className="p-1 w-24 ml-5 border border-transparent rounded hover:bg-gray-50">Messaging</button> 
        <button className="p-1 w-20 ml-5 border border-transparent rounded hover:bg-gray-50">Profile</button> 
        <button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 shadow-md hover:bg-pink-400">Premium</button> 
        </div>
    </div>
  );
}

export default Navbar;
