import React from 'react';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../Store/storeSlices/adminAuth';

const Navbar = () => {
  const dispatch= useDispatch()
  return (
        <div className='h-16 w-full bg-pink-100 border-b-gray-50'>
            <div className='w-full flex justify-between'>
                <div className='w-34 h-12 pt-2 pl-12 flex justify-center'>
                <img className='w-18 h-12' src="/skillset-logo.jpg" alt="" />
                </div>  
                <div className='pt-5 text-pink-600' style={{fontFamily:"cursive",fontWeight:"bold"}}>Hello admin</div>
                <button onClick={()=>{
                   localStorage.removeItem("adminInformation")
                   dispatch(adminLogout())
                }} className="p-1 w-20 mr-20 mt-4 ml-5 border border-transparent  text-white rounded bg-pink-500 
                shadow-md hover:bg-pink-400">SignOut</button>
            </div>
        </div>
  );
}

export default Navbar;
