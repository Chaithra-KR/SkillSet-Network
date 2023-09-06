import React, { useState, useRef, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Axios from 'axios';
import {toast} from 'react-hot-toast';
import {UserApi} from '../../APIs/api';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('')
    const inputRefs = useRef([]);
    const location = useLocation()
    const navigate = useNavigate()

    const handleSubmit = (e)=>{
      e.preventDefault()
      Axios.post(`${UserApi}otp`,{data :location?.state.data, otp:otp }).then((res)=>{
        console.log(res);
        if(res.data.success){
          console.log("data success");
          setMessage(res.data.message)
          navigate('/login')

        }else{
          console.log("Invalid OTP");
          toast.error(res.data.message,{
            duration:3000,
            position:'top-center',
            style:{
              background:'#ff0000',
              color:'#fff'
            }
          })

        }
      }).catch((error)=>{
        console.log(error);
      })
    }
  
    // Function to handle input changes
    const handleInputChange = (e, index) => {
      const newOtp = [...otp];
      newOtp[index] = e.target.value;
  
      // Move to the next input box if a number is entered
      if (/^\d+$/.test(e.target.value) && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
  
      setOtp(newOtp);
    };
  
    // Function to handle Backspace key
    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !otp[index]) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          inputRefs.current[index - 1].focus();
          setOtp(newOtp);
        }
      };
  
    // Focus on the first input field when the component mounts
    useEffect(() => {
      inputRefs.current[0].focus();
    }, []);
  
    return (
      <div className="flex justify-center h-screen bg-pink-50">
        <div className="w-1/2 h-96 flex justify-center m-24 items-center border-2 bg-white border-pink-100 shadow-md">
            <div>
                <h2 className="mb-3 text-center font-bold font-sans">Verification code</h2>
                <p className="text-center font-mono">Please enter the verification code sent to Email</p>
                <form onSubmit={handleSubmit} className="mx-8 mt-4" noValidate>
                    <div className="flex justify-center">
                    {otp.map((digit, index) => (
                        <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        className="w-10 h-10 text-center border mx-1"
                        value={digit}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        />
                    ))}
                    </div>
                    <div className="flex justify-center mt-5">
                    <button className="btn btn-dark w-1/2" type="submit">
                        Submit
                    </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    );
}

export default OTP;
