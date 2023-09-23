import React,{useEffect, useState} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {CompanyApi} from '../../configs/api';
import {toast} from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import { companyDetails } from '../../Store/storeSlices/companyAuth';
import { companyAxiosInstance } from '../../configs/axios/axios';

const CompanyAccess = () => {
    const [currentView, setCurrentView] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors } } = useForm();


    
  const submitData = async (data) => {
    try {
      console.log(data,"this data");
      const res = await companyAxiosInstance.get(`${CompanyApi}company-generateOtp?data=${data.email}`).then((res)=>{
        console.log(data,"this data");
         if(res.data.success==true){
          console.log("navigating to otp so otp page will display");
          navigate('/company/company-otp', { state: { data } });
         }else{
          console.log("something wrong");
         }
      })
     
    } catch (error) {
      console.log(error);
    }
  }
  

  const loginSubmit = async (data) => {
    try {
      // const response = await Axios.post(`${CompanyApi}verifyCompanyLogin`, { data });
      const response = await companyAxiosInstance.post(`${CompanyApi}verifyCompanyLogin`, { data });

      if (response.data.success) {
        localStorage.setItem('companyInformation',JSON.stringify(response.data.necessaryData))
        let impData = response.data.necessaryData
        dispatch(companyDetails(impData)) 
        toast.success(response.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#B00043',
            color: '#fff',
          },
        });
        navigate('/company/central-hub');
      } else  {
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


    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"  
        style={{
          backgroundImage: 'url(https://images.lawpath.com.au/2020/06/sean-pollock-PhYq704ffdA-unsplash-scaled.jpg)',
        }}
      >
       
        <div className="w-full max-w-xl p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
          {currentView ? (
            <>
            <form onSubmit={handleSubmit(submitData)}>
              <h2 className="text-center text-2xl mb-4 text-gray-800">Register Your Company!</h2>
              <fieldset>
              <ul>
              
                <li className="grid gap-2">
                  <label htmlFor="company" className="text-left">Company name:</label>
                  <input {...register("company", { required: true, pattern: /^[^\s]+$/ })} type="text" id="company" className="px-3 py-2 border rounded-lg w-full" />
                  {errors.company && errors.company.type === "required"&& <label className='text-sm text-red-600'>Please enter your company name</label>}
                  {errors.company && errors.company.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid company name</label>}
                </li>
                <li className="grid gap-2">
                  <label htmlFor="startedDate" className="text-left">Started date:</label>
                  <input {...register("startedDate",{required:true})} type="date" id="startedDate" className="px-3 py-2 border rounded-lg w-full" />
                  {errors.startedDate && errors.startedDate.type === "required" && <label className='text-sm text-red-600'>Please enter the dob</label>}
                </li>
                <li className="grid gap-2">
                  <label htmlFor="headline" className="text-left"> Headline</label>
                  <input {...register("headline",{required:true, pattern: /^.{2,56}$/})} type="text" id="headline"  className="px-3 py-2 border rounded-lg w-full" />
                  {errors.headline && errors.headline.type === "required" && <label className='text-sm text-red-600'>Please enter the headline</label>}
                  {errors.headline && errors.headline.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid headline (maximum 56 characters)</label>}
                </li>
                <li className="grid gap-2">
                  <label htmlFor="phone" className="text-left">Phone:</label>
                  <input {...register("phone", {required: true, pattern: /^[0-9]{10}$/})} type="tel" id="phone" className="px-3 py-2 border rounded-lg w-full"/>
                  {errors.phone && errors.phone.type === "required" && (<label className='text-sm text-red-600'>Please enter your phone number</label>)}
                  {errors.phone && errors.phone.type === "pattern" && (<label className='text-sm text-red-600'>Please enter a valid 10-digit phone number</label>)}
                </li>

                <li className="grid gap-2">
                  <label htmlFor="about" className="text-left">About:</label>
                  <input {...register("about",{pattern: /^.{1,180}$/})}  type="text" id="about" required className="px-3 py-2 border rounded-lg w-full" />
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

                <li className="grid gap-2 mt-8">
                  <label htmlFor="address" className="text-center mb-2 text-xl text-black">Address:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="building">Building:</label>
                      <input
                        {...register("address.building", {
                          required: true,
                        })}
                        type="text"
                        id="building"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.building && (
                        <label className='text-sm text-red-600'>Please enter the building</label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city">City:</label>
                      <input
                        {...register("address.city", {
                          required: true,
                        })}
                        type="text"
                        id="city"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.city && (
                        <label className='text-sm text-red-600'>Please enter the city</label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="pin">Pin:</label>
                      <input
                        {...register("address.pin", {
                          required: true,
                          pattern: /^[0-9]{6}$/, // Assumes a 6-digit pin code format
                        })}
                        type="text"
                        id="pin"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.pin && errors.address.pin.type === "required" && (
                        <label className='text-sm text-red-600'>Please enter the pin code</label>
                      )}
                      {errors.address?.pin && errors.address.pin.type === "pattern" && (
                        <label className='text-sm text-red-600'>
                          Please enter a valid 6-digit pin code
                        </label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="district">District:</label>
                      <input
                        {...register("address.district", {
                          required: true,
                        })}
                        type="text"
                        id="district"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.district && (
                        <label className='text-sm text-red-600'>Please enter the district</label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state">State:</label>
                      <input
                        {...register("address.state", {
                          required: true,
                        })}
                        type="text"
                        id="state"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.state && (
                        <label className='text-sm text-red-600'>Please enter the state</label>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
              </fieldset>
              <button className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">Submit</button>
              <button type="button" onClick={handleLoginView} className="text-blue-500 w-full text-center pt-4 ">Have an Account?</button>
            </form>
            </>
          ) : (
            <>
            <form onSubmit={handleSubmit(loginSubmit)}>
              <h2 className="text-center text-2xl mb-4 text-gray-800">Login to Your Account!</h2>
              <fieldset>
                <ul>
                <ul className="m-1 p-1">
                  <li className="mb-4">
                    <label htmlFor="email" className="text-left block pb-2">Email:</label>
                    <input {...register("email", { required: true, pattern:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})} type="text" id="username" className="w-full p-2 border border-gray-300 rounded" required />
                    {errors.email && errors.email.type === "required"&& <label className='text-sm text-red-600'>Please enter the email</label>}
                  </li>
                  <li className="mb-4">
                    <label htmlFor="password" className="text-left block pb-2">Password:</label>
                    <input {...register("password",{required:true})} type="password" id="password" className="w-full p-2 border border-gray-300 rounded" required />
                    {errors.password && errors.password.type === "required" && <label className='text-sm text-red-600'>Please enter the password</label>}
                  </li>
                </ul>
                </ul>
              </fieldset>
              <button className="w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">Login</button>
              <button type="button" onClick={handleRegisterView} className="text-blue-500 w-full text-center pt-4">Create an Account</button>
            </form>
            </>
          )}
        </div>
      </div>
    );
}

export default CompanyAccess;
