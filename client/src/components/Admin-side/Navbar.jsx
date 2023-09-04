import React from 'react';

const Navbar = () => {
  return (
        <div className='h-16 w-full bg-pink-50 border-b-2 border-b-gray-50'>
            <div className='w-6/12 flex justify-between'>
                <div className='w-34 h-12 pt-2 pl-12 flex justify-center'>
                <img className='w-18 h-12' src="/skillset logo.jpg" alt="" />
                </div>  
                <div className='pt-5 text-pink-600' style={{fontFamily:"cursive",fontWeight:"bold"}}>Hello admin</div>
            </div>
        </div>
  );
}

export default Navbar;
