import React from 'react';

const SignIn = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen"  
    style={{
      backgroundImage: 'url(https://media.istockphoto.com/id/1384110533/photo/asian-male-director-is-interviewing-to-recruit-new-employees.jpg?s=612x612&w=0&k=20&c=rR1-wkWClaIfcH7vwut8L2AXK3LML2RLQ-xZ60ZrwEE=)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <form className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow-md">
        <h2 className="text-center text-2xl mb-4  text-gray-800">Admin Login!</h2>
        <fieldset className="bg-white mb-4 rounded-lg  ">
          <ul className="m-1 p-1">
            <li className="mb-4">
              <label htmlFor="username" className="text-left block pb-2">Username:</label>
              <input type="text" id="username" className="w-full p-2 border border-gray-300 rounded" required />
            </li>
            <li className="mb-4">
              <label htmlFor="password" className="text-left block pb-2">Password:</label>
              <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded" required />
            </li>
          </ul>
        </fieldset>
        <button className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
      </form>
    </div>
  );
}

export default SignIn;
