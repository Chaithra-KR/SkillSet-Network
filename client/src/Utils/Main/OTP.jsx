import React, { useState, useRef, useEffect } from 'react';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
  
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
                <form yclassName="mx-8 mt-4" noValidate>
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
                    <div id="notification" className="mb-4">
                    {/* Render your message here */}
                    </div>
                    <div className="flex justify-center">
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
