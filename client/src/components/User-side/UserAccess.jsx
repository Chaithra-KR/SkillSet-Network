import React, { useEffect, useState } from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import Axios from 'axios';
import {UserApi} from '../../APIs/api';

const UserAccess = () => {
  const [currentView, setCurrentView] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // validation
  const submitData = (data) =>{
    console.log(data);
    Axios.get(`${UserApi}generateOtp?data=${data.email}`).then(()=>{

    }).catch(()=>{

    })
    navigate('/OTP',{state:{data}})
  }


  const validatePassword = (password) => {
    let errorMessage = "";

    if (password.length < 8) {
      errorMessage += "Password must be at least 8 characters long. ";
    }

    if (!/\d/.test(password)) {
      errorMessage += "Password must include at least one digit. ";
    }

    if (!/[a-z]/.test(password)) {
      errorMessage += "Password must include at least one lowercase letter. ";
    }

    if (!/[A-Z]/.test(password)) {
      errorMessage += "Password must include at least one uppercase letter. ";
    }

    return errorMessage || true;
  };

  //router handling
  useEffect(() => {
    setCurrentView(location.pathname === "/signUp")
  }, [location]);

  const handleRegisterSuccess = () =>{
    navigate('/OTP')
  }
  const handleLoginSuccess = () =>{
    navigate('/home')
  }
  const handleRegisterView = () =>{
    navigate('/signUp')
  }
  const handleLoginView = () =>{
    navigate('/login')
    setCurrentView(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"  
      style={{
        backgroundImage: 'url(https://media.istockphoto.com/id/1384110533/photo/asian-male-director-is-interviewing-to-recruit-new-employees.jpg?s=612x612&w=0&k=20&c=rR1-wkWClaIfcH7vwut8L2AXK3LML2RLQ-xZ60ZrwEE=)',
      }}
    >
      <div className="w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
        {currentView ? (
          <>
          <form onSubmit={handleSubmit(submitData)}>
            <h2 className="text-center text-2xl mb-4 text-gray-800">Sign Up!</h2>
            <fieldset>
            <ul>
              <li className="grid gap-2">
                <label htmlFor="username" className="text-left">Username:</label>
                <input {...register("username", { required: true, pattern: /^[^\s]+$/ })} type="text" id="username" className="px-3 py-2 border rounded-lg w-full" />
                {errors.username && errors.username.type === "required"&& <label className='text-sm text-red-600'>Please enter the username</label>}
                {errors.username && errors.username.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter valid username</label>}
              </li>
              <li className="grid gap-2">
                <label htmlFor="dob" className="text-left">DOB:</label>
                <input {...register("dob",{required:true})} type="date" id="dob"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.dob && errors.dob.type === "required" && <label className='text-sm text-red-600'>Please enter the dob</label>}
                {errors.dob && errors.dob.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter valid Date of birth</label>}
              </li>
              <li className="grid gap-2">
                <label htmlFor="headline" className="text-left">Headline:</label>
                <input {...register("headline",{required:true, pattern: /^.{2,56}$/})} type="text" id="headline"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.headline && errors.headline.type === "required" && <label className='text-sm text-red-600'>Please enter the headline</label>}
                {errors.headline && errors.headline.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid headline (maximum 56 characters)</label>}
              </li>
              <li className="grid gap-2">
                <label htmlFor="about" className="text-left">About: (optional)</label>
                <input {...register("about",{pattern: /^.{1,180}$/})} type="text" id="about"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.about && errors.about.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid headline (maximum 180 characters)</label>}
              </li>
              <li className="grid gap-2">
                <label htmlFor="email" className="text-left">Email:</label>
                <input {...register("email",{required:true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})}  type="email" id="email"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.email && errors.email.type === "required" && <label className='text-sm text-red-600'>Please enter the email</label>}
                {errors.email && errors.email.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid email</label>}
              </li>
              <li className="grid gap-2">
                <label htmlFor="password" className="text-left">Password:</label>
                <input {...register("password",{required:true, validate:validatePassword})} type="password" id="password"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.password && errors.password.type === "required" && <label className='text-sm text-red-600'>Please enter the password</label>}
                {errors.password && (<label className="text-sm text-red-600">{errors.password.message}</label>)}
              </li>
            </ul>
            </fieldset>
            <button  className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">Submit</button>
            <button type="button" onClick={handleLoginView} className="text-blue-500 w-full text-center pt-4 ">Have an Account?</button>
          </form>
          </>
        ) : (
          <>
          <form action="">
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
            <button onClick={handleLoginSuccess} className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
            <button type="button" onClick={handleRegisterView} className="text-blue-500 w-full text-center pt-4">Create an Account</button>
          </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAccess;
