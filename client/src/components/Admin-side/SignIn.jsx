import React from 'react';
import Axios from 'axios';
import { AdminApi } from '../../APIs/api';
import {toast} from 'react-hot-toast';
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminDetails } from '../../Store/storeSlices/adminAuth';


const SignIn = () => {

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const dispatch = useDispatch()
  
  const handleLoginSubmit = async (data) => {
    try {
      console.log(data);
      const response = await Axios.post(`${AdminApi}adminVerifyLogin`,{data:data});
      if (response.data.success) {
        localStorage.setItem('adminInformation',JSON.stringify(response.data.necessaryData))
        let impData = response.data.necessaryData 
        console.log(impData,"{data}");
        dispatch(adminDetails(impData))    

        toast.success(response.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#B00043',
            color: '#fff',
          },
        });
          navigate('/admin/dashboard')
      }else{
        toast.error(response.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ff0000',
            color: '#fff',
          },
        });
      }
   }catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="flex items-center justify-center w-full h-screen"  
    style={{
      backgroundImage: 'url(https://media.istockphoto.com/id/1384110533/photo/asian-male-director-is-interviewing-to-recruit-new-employees.jpg?s=612x612&w=0&k=20&c=rR1-wkWClaIfcH7vwut8L2AXK3LML2RLQ-xZ60ZrwEE=)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <form onSubmit={handleSubmit(handleLoginSubmit)} className="w-full max-w-md p-10 bg-white bg-opacity-90  rounded-lg shadow-md">
        <h2 className="text-center text-2xl mb-4  text-gray-800">Admin Login!</h2>
        <fieldset className="bg-white mb-4 rounded-lg  ">
          <ul className="m-1 p-1">
          <li className="grid gap-2">
                <label htmlFor="email" className="text-left">Email:</label>
                <input {...register("email",{required:true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})}  type="email" id="email"  className="px-3 py-2 border rounded-lg w-full" />
                {errors.email && errors.email.type === "required" && <label className='text-sm text-red-600'>Please enter the email</label>}
                {errors.email && errors.email.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid email</label>}
              </li>
              <li className="mb-4">
                  <label htmlFor="password" className="text-left block pb-2">Password:</label>
                  <input {...register("password",{required:true})} type="password" id="password" className="w-full p-2 border border-gray-300 rounded" required />
                  {errors.password && errors.password.type === "required" && <label className='text-sm text-red-600'>Please enter the password</label>}
                </li>
          </ul>
        </fieldset>
        <button className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
      </form>
    </div>
  );
}

export default SignIn;
