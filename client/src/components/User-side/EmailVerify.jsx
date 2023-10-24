import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserApi } from "../../configs/api";
import { toast } from "react-hot-toast";

const EmailVerify = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const submitData = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(`${UserApi}emailVerify?data=${data.email}`, {
        data: data,
      });
      if (response.data.success === false) {
        toast.error(response.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#ff0000",
            color: "#fff",
          },
        });
      } else {
        navigate("/forgotPassword",{state: { data }});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Password assistance
            </h2>
            <form
              onSubmit={handleSubmit(submitData)}
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            >
              <div>
                <label
                  for="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter the email address associated with your SkillSet Network
                  account.
                </label>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter the email here
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("email", {
                      required: true,
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <>
                    {errors.email && errors.email.type === "required" && (
                      <label className="text-sm text-red-600">
                        Please enter the email
                      </label>
                    )}
                    {errors.email && errors.email.type === "pattern" && (
                      <label className="text-sm text-red-600">
                        Please enter a valid email
                      </label>
                    )}
                  </>
                </div>
              </div>
              <button class="w-full text-white bg-pink-500 hover:bg-pink-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Verify
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailVerify;
