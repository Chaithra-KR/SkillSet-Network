import React, { useEffect, useState } from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import Axios from 'axios';
import {toast} from 'react-hot-toast';
import {UserApi} from '../../APIs/api'; 
import {useDispatch} from 'react-redux';
import {seekerDetails} from '../../Store/storeSlices/seekerAuth';
import {TiDeleteOutline} from 'react-icons/ti';
import moment from 'moment';


const UserAccess = () => {
  const [currentView, setCurrentView] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [dob, setDob] = useState('')
  const [errorMessage, setErrorMessage] = useState('');

  // Date validation function
  const handleValidDate = (selectedDate) => {
    if (!selectedDate) {
      setErrorMessage('');
      return true;
    }
    const age = moment().diff(selectedDate, 'years');
    if (age < 18) {
      setErrorMessage('Maximum age requirement is 18!');
      return false;
    } else {
      setErrorMessage('');
      return true;
    }
  };

  const [skills, setSkills] = useState([]);
  const addSkill = () => {
    const skillInput = document.getElementById('skill-input');
    const skillText = skillInput.value.trim();
    if (skillText) {
      setSkills([...skills, skillText]);
      skillInput.value = ''; 
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const submitData = async (data) => {
    try {
      console.log(data);
      data.skills = skills;
      const res = await Axios.get(`${UserApi}generateOtp?data=${data.email}`);
      console.log(res);
      console.log(res,"oooo");
      navigate('/Otp', { state: { data } });
    } catch (error) {
      console.log(error);
    }
  }
  
  const loginSubmit = async (data) => {
    try {
      const response = await Axios.post(`${UserApi}verifyLogin`, { data });
      if (response.data.success) {
        localStorage.setItem('userInformation',JSON.stringify(response.data.necessaryData))
        let impData = response.data.necessaryData 
        dispatch(seekerDetails(impData))    
        toast.success(response.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#B00043',
            color: '#fff',
          },
        });
        navigate('/home');
      } else {
        if (response.data.emailMessage) {
          console.log("Email did not match our records, Please Register!");
          toast.error(response.data.emailMessage, {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#ff0000',
              color: '#fff',
            },
          });
        } else if (response.data.message === "Incorrect password!") {
          console.log("Password is incorrect!");
          toast.error(response.data.message, {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#ff0000',
              color: '#fff',
            },
          });
        } else if (response.data.accessBlocked) {
          console.log("Access Blocked!");
          toast.error(response.data.accessBlocked, {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#ff0000',
              color: '#fff',
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };  
  
  

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

  const handleRegisterView = () =>{
    navigate('/signUp')
  }
  const handleLoginView = () =>{
    navigate('/login')
    setCurrentView(false)
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url(https://media.istockphoto.com/id/1384110533/photo/asian-male-director-is-interviewing-to-recruit-new-employees.jpg?s=612x612&w=0&k=20&c=rR1-wkWClaIfcH7vwut8L2AXK3LML2RLQ-xZ60ZrwEE=)',
      }}
    >
      <div className="">
        {currentView ? (
          <>
          <div className='w-full max-w-4xl p-4 bg-white bg-opacity-90 rounded-lg shadow-md'>
            <form onSubmit={handleSubmit(submitData)} className="w-full">
            <h2 className="text-center text-2xl mb-4 text-gray-800">Sign Up!</h2>
          <fieldset>
            <ul>
            <li className="grid gap-2 mt-8">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="username" className="text-left">Username:</label>
                    <input {...register("username", { required: true, pattern: /^[^\s]+$/ })} type="text" id="username" className="px-3 py-2 border rounded-lg w-full" />
                    {errors.username && errors.username.type === "required"&& <label className='text-sm text-red-600'>Please enter the username</label>}
                    {errors.username && errors.username.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter valid username</label>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="dob" className="text-left">DOB:</label>
                    <input {...register("dob",{required:true , validate: handleValidDate})} type="date" id="dob"  className="px-3 py-2 border rounded-lg w-full" />
                    {errors.dob && errors.dob.type === "required" && <label className='text-sm text-red-600'>Please enter the dob</label>}
                    {errorMessage && <p className="error-message text-sm text-red-600">{errorMessage}</p>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="headline" className="text-left">Headline:</label>
                    <input {...register("headline",{required:true, pattern: /^.{2,56}$/})} type="text" id="headline"  className="px-3 py-2 border rounded-lg w-full" />
                    {errors.headline && errors.headline.type === "required" && <label className='text-sm text-red-600'>Please enter the headline</label>}
                    {errors.headline && errors.headline.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid headline (maximum 56 characters)</label>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="email" className="text-left">Email:</label>
                    <input {...register("email",{required:true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})}  type="email" id="email"  className="px-3 py-2 border rounded-lg w-full" />
                    {errors.email && errors.email.type === "required" && <label className='text-sm text-red-600'>Please enter the email</label>}
                    {errors.email && errors.email.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid email</label>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="password" className="text-left">Password:</label>
                    <input {...register("password",{required:true, validate:validatePassword})} type="password" id="password"  className="px-3 py-2 border rounded-lg w-full" />
                    {errors.password && errors.password.type === "required" && <label className='text-sm text-red-600'>Please enter the password</label>}
                    {errors.password && (<label className="text-sm text-red-600">{errors.password.message}</label>)}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="phone" className="text-left">Phone:(optional)</label>
                    <input {...register("phone", { pattern: /^[0-9]{10}$/})} type="tel" id="phone" className="px-3 py-2 border rounded-lg w-full"/>
                    {errors.phone && errors.phone.type === "pattern" && (<label className='text-sm text-red-600'>Please enter a valid 10-digit phone number</label>)}
                  </div>

                </div>
              </li>
              
              <li className="grid gap-2 mt-6">
                <label htmlFor="location" className="text-center mb-2 text-xl text-black">Location:</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="city">City:</label>
                    <input
                      {...register("location.city", {
                        required: true,
                      })}
                      type="text"
                      id="city"
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                    {errors.location?.city && (
                      <label className='text-sm text-red-600'>Please enter the city</label>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="district">District:</label>
                    <input
                      {...register("location.district", {
                        required: true,
                      })}
                      type="text"
                      id="district"
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                    {errors.location?.district && (
                      <label className='text-sm text-red-600'>Please enter the district</label>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="state">State:</label>
                    <input
                      {...register("location.state", {
                        required: true,
                      })}
                      type="text"
                      id="state"
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                    {errors.location?.state && (
                      <label className='text-sm text-red-600'>Please enter the state</label>
                    )}
                  </div>
                </div>
              </li>
              </ul>
          </fieldset>
          <div className='flex justify-center'>
          <button className="px-4 py-2 m-4 border w-2/6 rounded-lg shadow hover:bg-gray-300 hover:border-gray-400">Submit</button>
          </div>
          <button type="button" onClick={handleLoginView} className="text-blue-500 w-full text-center pt-4">Have an Account?</button>
          </form>
          </div>
          </>
        ) : (
            <>
          <div className='w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md'>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <h2 className="text-center text-2xl mb-4 text-gray-800">Welcome Back!</h2>
            <fieldset>
              <ul>
              <ul className="m-1 p-1">
                <li className="mb-4">
                  <label htmlFor="email" className="text-left block pb-2">Email:</label>
                  <input {...register("email", { required: true, pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})} type="text" id="username" className="w-96 p-2 border border-gray-300 rounded" />
                  {errors.email && errors.email.type === "required"&& <label className='text-sm text-red-600'>Please enter the email</label>}
                </li>
                <li className="mb-4">
                  <label htmlFor="password" className="text-left block pb-2">Password:</label>
                  <input {...register("password",{required:true})} type="password" id="password" className="w-96 p-2 border border-gray-300 rounded" />
                  {errors.password && errors.password.type === "required" && <label className='text-sm text-red-600'>Please enter the password</label>}
                </li>
              </ul>
              </ul>
            </fieldset>
            <button className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
            <button type="button" onClick={handleRegisterView} className="text-blue-500 w-full text-center pt-4">Create an Account</button>
          </form>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAccess;
