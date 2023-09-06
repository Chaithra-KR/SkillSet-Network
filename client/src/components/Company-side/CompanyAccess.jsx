import React,{useEffect, useState} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';

const CompanyAccess = () => {
    const [currentView, setCurrentView] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();


    useEffect(() => {
      setCurrentView(location.pathname === '/company/company-signUp')
    }, [location]);

    const handleRegisterView = () =>{
      navigate('/company/company-signUp')
    }

    const handleLoginView = () =>{
      navigate('/company/company-login')
      setCurrentView(false)
    }

    const handleLoginSuccess = () =>{
      navigate('/company/central-hub')
    }

    const handleRegisterSuccess = () =>{
      navigate('/company/company-login')
    }
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"  
        style={{
          backgroundImage: 'url(https://images.lawpath.com.au/2020/06/sean-pollock-PhYq704ffdA-unsplash-scaled.jpg)',
        }}
      >
        <div className="w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
          {currentView ? (
            <>
              <h2 className="text-center text-2xl mb-4 text-gray-800">Register Your Company!</h2>
              <fieldset>
              <ul>
                <li className="grid gap-2">
                  <label htmlFor="username" className="text-left">Company name:</label>
                  <input type="text" id="username" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="startedDate" className="text-left">Started date:</label>
                  <input type="date" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="phone" className="text-left"> Contact No:</label>
                  <input type="phone" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="address" className="text-left"> Address:</label>
                  <input type="text" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
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
              <button onClick={handleRegisterSuccess} className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">Submit</button>
              <button type="button" onClick={handleLoginView} className="text-blue-500 w-full text-center pt-4 ">Have an Account?</button>
            </>
          ) : (
            <>
              <h2 className="text-center text-2xl mb-4 text-gray-800">Login to Your Account!</h2>
              <fieldset>
                <ul>
                <ul className="m-1 p-1">
                  <li className="mb-4">
                    <label htmlFor="email" className="text-left block pb-2">Email:</label>
                    <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded" required />
                  </li>
                  <li className="mb-4">
                    <label htmlFor="password" className="text-left block pb-2">Password:</label>
                    <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded" required />
                  </li>
                </ul>
                </ul>
              </fieldset>
              <button onClick={handleLoginSuccess} className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
              <button type="button" onClick={handleRegisterView} className="text-blue-500 w-full text-center pt-4">Create an Account</button>
            </>
          )}
        </div>
      </div>
    );
}

export default CompanyAccess;
