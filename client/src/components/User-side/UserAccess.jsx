import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Axios from "axios";
import { toast } from "react-hot-toast";
import { UserApi } from "../../configs/api";
import { useDispatch } from "react-redux";
import { seekerDetails } from "../../Store/storeSlices/seekerAuth";
import moment from "moment";

const UserAccess = () => {
  const [currentView, setCurrentView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");

  // Date validation function
  const handleValidDate = (selectedDate) => {
    if (!selectedDate) {
      setErrorMessage("");
      return true;
    }
    const age = moment().diff(selectedDate, "years");
    if (age < 18) {
      setErrorMessage("Maximum age requirement is 18!");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const submitData = async (data) => {
    try {
      const res = await Axios.get(`${UserApi}generateOtp?data=${data.email}`);
      navigate("/Otp", { state: { data } });
    } catch (error) {
      console.log(error);
    }
  };

  const loginSubmit = async (data) => {
    try {
      const response = await Axios.post(`${UserApi}verifyLogin`, { data });
      if (response.data.success) {
        localStorage.setItem(
          "userInformation",
          JSON.stringify(response.data.necessaryData)
        );
        let impData = response.data.necessaryData;
        dispatch(seekerDetails(impData));
        toast.success(response.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
        navigate("/home");
      } else {
        if (response.data.emailMessage) {
          toast.error(response.data.emailMessage, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#ff0000",
              color: "#fff",
            },
          });
        } else if (response.data.message === "Incorrect password!") {
          toast.error(response.data.message, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#ff0000",
              color: "#fff",
            },
          });
        } else if (response.data.accessBlocked) {
          toast.error(response.data.accessBlocked, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#ff0000",
              color: "#fff",
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
    setCurrentView(location.pathname === "/signUp");
  }, [location]);

  const handleRegisterView = () => {
    navigate("/signUp");
  };
  const handleLoginView = () => {
    navigate("/login");
    setCurrentView(false);
  };

  return (
    <div className="relative">
      <img src="/seeker-bg.jpg" alt="Your Image" className="w-full" />
      <div className="absolute top-0 left-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-40 ">
        <div>
          {currentView ? (
            <>
              <div className="w-full max-w-3xl p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(submitData)}>
                  <h2 className="text-center text-2xl mb-4 text-gray-800">
                    Sign Up!
                  </h2>
                  <fieldset>
                    <ul>
                      <li className="grid gap-2 mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="col-span-1">
                            <label htmlFor="username" className="text-left">
                              Username:
                            </label>
                            <input
                              {...register("username", {
                                required: true,
                                pattern: /^[^\s]+$/,
                              })}
                              type="text"
                              id="username"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                            {errors.username &&
                              errors.username.type === "required" && (
                                <label className="text-sm text-red-600">
                                  Please enter the username
                                </label>
                              )}
                            {errors.username &&
                              errors.username.type === "pattern" && (
                                <label className="text-sm text-red-600">
                                  Please enter valid username
                                </label>
                              )}
                          </div>

                          <div className="col-span-1">
                            <label htmlFor="dob" className="text-left">
                              DOB:
                            </label>
                            <input
                              {...register("dob", {
                                required: true,
                                validate: handleValidDate,
                              })}
                              type="date"
                              id="dob"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                            {errors.dob && errors.dob.type === "required" && (
                              <label className="text-sm text-red-600">
                                Please enter the dob
                              </label>
                            )}
                            {errorMessage && (
                              <p className="error-message text-sm text-red-600">
                                {errorMessage}
                              </p>
                            )}
                          </div>

                          <div className="col-span-1">
                            <label htmlFor="headline" className="text-left">
                              Headline:
                            </label>
                            <input
                              {...register("headline", {
                                required: true,
                                pattern: /^.{2,56}$/,
                              })}
                              type="text"
                              id="headline"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                            {errors.headline &&
                              errors.headline.type === "required" && (
                                <label className="text-sm text-red-600">
                                  Please enter the headline
                                </label>
                              )}
                            {errors.headline &&
                              errors.headline.type === "pattern" && (
                                <label className="text-sm text-red-600">
                                  Please enter a valid headline (maximum 56
                                  characters)
                                </label>
                              )}
                          </div>

                          <div className="col-span-1">
                            <label htmlFor="email" className="text-left">
                              Email:
                            </label>
                            <input
                              {...register("email", {
                                required: true,
                                pattern:
                                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                              })}
                              type="email"
                              id="email"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                            {errors.email &&
                              errors.email.type === "required" && (
                                <label className="text-sm text-red-600">
                                  Please enter the email
                                </label>
                              )}
                            {errors.email &&
                              errors.email.type === "pattern" && (
                                <label className="text-sm text-red-600">
                                  Please enter a valid email
                                </label>
                              )}
                          </div>

                          <div className="col-span-1">
                            <label htmlFor="password" className="text-left">
                              Password:
                            </label>
                            <input
                              {...register("password", {
                                required: true,
                                validate: validatePassword,
                              })}
                              type="password"
                              id="password"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
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
                          </div>

                          <div className="col-span-1">
                            <label htmlFor="phone" className="text-left">
                              Phone:(optional)
                            </label>
                            <input
                              {...register("phone", { pattern: /^[0-9]{10}$/ })}
                              type="tel"
                              id="phone"
                              className="px-3 py-2 border rounded-lg w-full"
                            />
                            {errors.phone &&
                              errors.phone.type === "pattern" && (
                                <label className="text-sm text-red-600">
                                  Please enter a valid 10-digit phone number
                                </label>
                              )}
                          </div>
                        </div>
                      </li>

                      <li className="grid gap-2 mt-2">
                        <label
                          htmlFor="location"
                          className="text-center mb-2 text-xl text-black"
                        >
                          Location:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
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
                              <label className="text-sm text-red-600">
                                Please enter the city
                              </label>
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
                              <label className="text-sm text-red-600">
                                Please enter the district
                              </label>
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
                              <label className="text-sm text-red-600">
                                Please enter the state
                              </label>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </fieldset>
                  <div className="flex justify-center">
                    <button className="px-4 py-2 m-4 border w-3/6 rounded-lg shadow hover:bg-gray-300 hover:border-gray-400">
                      Submit
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoginView}
                    className="text-blue-500 w-full text-center pt-4"
                  >
                    Have an Account?
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="w-[300px] sm:w-full p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(loginSubmit)}>
                  <h2 className="text-center text-2xl mb-4 text-gray-800">
                    Welcome Back!
                  </h2>
                  <fieldset>
                    <ul>
                      <li className="mb-4">
                        <label htmlFor="email" className="text-left block pb-2">
                          Email:
                        </label>
                        <input
                          {...register("email", {
                            required: true,
                            pattern:
                              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          })}
                          type="text"
                          id="username"
                          className="w-64 sm:w-96 p-2 border border-gray-300 rounded"
                        /> <br />
                        {errors.email && errors.email.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the email
                          </label>
                        )}
                      </li>
                      <li className="mb-2">
                        <label
                          htmlFor="password"
                          className="text-left block pb-2"
                        >
                          Password:
                        </label>
                        <input
                          {...register("password", { required: true })}
                          type="password"
                          id="password"
                          className="w-64 sm:w-96 p-2 border border-gray-300 rounded"
                        /> <br/>
                        {errors.password &&
                          errors.password.type === "required" && (
                            <label className="text-sm text-red-600">
                              Please enter the password
                            </label>
                          )}
                      </li>
                    </ul>
                    <h5
                      onClick={() => {
                        navigate("/verify-email");
                      }}
                      className="text-blue-500 text-center pb-5 flex justify-start"
                    >
                      Forgot password ?
                    </h5>
                  </fieldset>
                  <button className="w-64 sm:w-full p-2 border border-transparent rounded bg-white shadow-md hover:bg-gray-200">
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleRegisterView}
                    className="text-blue-500 w-64 sm:w-full text-center pt-4"
                  >
                    Create an Account
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccess;
