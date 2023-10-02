import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const [passwordVisibleForConfirm, setPasswordVisibleForConfirm] =
    useState(false);
  const [passwordVisibleForCurrent, setPasswordVisibleForCurrent] =
    useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibilityForCurrent = () => {
    setPasswordVisibleForCurrent(!passwordVisibleForCurrent);
  };
  const togglePasswordVisibilityForConfirm = () => {
    setPasswordVisibleForConfirm(!passwordVisibleForConfirm);
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const token = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const submitData = async (data) => {
    try {
      console.log(data, "jj");
      const response = await axios.post(`${UserApi}changePassword`, {
        data: data,
        token: token,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
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
                  for="confirm-password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisibleForCurrent ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("currentPassword", { required: true })}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {errors.currentPassword &&
                    errors.currentPassword.type === "required" && (
                      <label className="text-sm text-red-600">
                        Please enter the password
                      </label>
                    )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibilityForCurrent}
                    className="absolute inset-y-0 right-2 flex items-center focus:outline-none"
                  >
                    {passwordVisibleForCurrent ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
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
                  {termsAccepted ? (
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
                  ) : null}

                  <button
                    type="button"
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
              {errors.newsletter && errors.newsletter.type === "required" && (
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
  );
};

export default ChangePassword;
