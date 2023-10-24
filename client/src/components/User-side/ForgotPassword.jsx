import React, { useRef, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserApi } from "../../configs/api";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibleForConfirm, setPasswordVisibleForConfirm] =
    useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();
  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityForConfirm = () => {
    setPasswordVisibleForConfirm(!passwordVisibleForConfirm);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  console.log(location.state.data);

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${UserApi}forgotPasswordOtp`, {
        data: location?.state.data,
        otp: otp,
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setShowForgot(true);
        } else {
          console.log("Invalid OTP");
          showToast(res.data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error);
        showToast("An error occurred while processing your request.", "error");
      });
  };

  const showToast = (message, type) => {
    toast(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: type === "success" ? "#00ff00" : "#ff0000",
        color: "#fff",
      },
    });
  };

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
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      inputRefs.current[index - 1].focus();
      setOtp(newOtp);
    }
  };

  // Focus on the first input field when the component mounts
  useEffect(() => {
    if (inputRefs.current && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  

  const submitData = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(`${UserApi}forgotPassword`, {
        data: data,
        emailData: location?.state.data,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
        navigate("/login");
      } else {
        toast.error(response.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#ff0000",
            color: "#fff",
          },
        });
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

  return (
    <>
      {!showForgot ? (
        <div className="flex justify-center h-screen bg-pink-50">
          <div className="w-1/2 h-96 flex justify-center m-24 items-center border-2 bg-white border-pink-100 shadow-md">
            <div>
              <h2 className="mb-3 text-center font-bold font-sans">
                Verification code
              </h2>
              <p className="text-center font-mono">
                Please enter the verification code sent to Email
              </p>
              <form onSubmit={handleOtpSubmit} className="mx-8 mt-4" noValidate>
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
      ) : (
        <div>
          <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Change Password
                </h2>
                <form
                  onSubmit={handleSubmit(submitData)}
                  className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                >
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        {...register("password", {
                          required: true,
                          validate: validatePassword,
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <>
                        {errors.password &&
                          errors.password.type === "required" && (
                            <label className="text-sm text-red-600">
                              Please enter the password
                            </label>
                          )}
                        {errors.password && (
                          <label className="text-sm text-red-600">
                            {errors.password.message}
                          </label>
                        )}
                      </>

                      <button
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-2 flex items-center focus:outline-none"
                      >
                        {passwordVisible ? (
                          <FaEyeSlash className="text-gray-500" />
                        ) : (
                          <FaEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      for="confirm-password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisibleForConfirm ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        {...register("confirmPassword", { required: true })}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {errors.confirmPassword &&
                        errors.confirmPassword.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the password
                          </label>
                        )}
                      <button
                        type="button"
                        onClick={togglePasswordVisibilityForConfirm}
                        className="absolute inset-y-0 right-2 flex items-center focus:outline-none"
                      >
                        {passwordVisibleForConfirm ? (
                          <FaEyeSlash className="text-gray-500" />
                        ) : (
                          <FaEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="newsletter"
                          aria-describedby="newsletter"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          {...register("newsletter", { required: true })}
                          value={confirmPassword}
                          onChange={handleTermsChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="newsletter"
                          className="font-light text-gray-500 dark:text-gray-300"
                        >
                          I accept the{" "}
                          <button className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            Terms and Conditions
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                  {errors.newsletter &&
                    errors.newsletter.type === "required" && (
                      <>
                        {!termsAccepted && (
                          <label className="text-sm text-red-600">
                            Please agree to the Terms and Conditions!
                          </label>
                        )}
                      </>
                    )}
                  <button class="w-full text-black bg-gray-300 hover:bg-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Reset password
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
