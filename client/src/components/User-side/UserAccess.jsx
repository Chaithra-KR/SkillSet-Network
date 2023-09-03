import React, { useState } from 'react';

const UserAccess = () => {
  const [currentView, setCurrentView] = useState(false);

  const changeView = () => {
    setCurrentView(!currentView);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"  
      style={{
        backgroundImage: 'url(https://media.istockphoto.com/id/1384110533/photo/asian-male-director-is-interviewing-to-recruit-new-employees.jpg?s=612x612&w=0&k=20&c=rR1-wkWClaIfcH7vwut8L2AXK3LML2RLQ-xZ60ZrwEE=)',
      }}
    >
      <div className="w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
        {currentView ? (
          <>
            <h2 className="text-center text-2xl mb-4 text-gray-800">Sign Up!</h2>
            <fieldset>
            <ul>
              <li className="grid gap-2">
                <label htmlFor="username" className="text-left">Username:</label>
                <input type="text" id="username" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
              <li className="grid gap-2">
                <label htmlFor="dob" className="text-left">DOB:</label>
                <input type="date" id="dob" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
              <li className="grid gap-2">
                <label htmlFor="headline" className="text-left">Headline:</label>
                <input type="text" id="headline" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
              <li className="grid gap-2">
                <label htmlFor="about" className="text-left">About:</label>
                <input type="text" id="about" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
              <li className="grid gap-2">
                <label htmlFor="email" className="text-left">Email:</label>
                <input type="email" id="email" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
              <li className="grid gap-2">
                <label htmlFor="password" className="text-left">Password:</label>
                <input type="password" id="password" required className="px-3 py-2 border rounded-lg w-full" />
              </li>
            </ul>
            </fieldset>
            <button className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">Submit</button>
            <button type="button" onClick={() => changeView("logIn")} className="text-blue-500 w-full text-center pt-4 ">Have an Account?</button>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl mb-4 text-gray-800">Welcome Back!</h2>
            <fieldset>
              <ul>
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
              </ul>
            </fieldset>
            <button className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
            <button type="button" onClick={() => changeView("logIn")} className="text-blue-500 w-full text-center pt-4">Create an Account</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAccess;
