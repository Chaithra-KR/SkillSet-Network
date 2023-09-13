import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { CompanyApi } from "../../APIs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {companyDetails} from '../../Store/storeSlices/companyAuth';
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [companyDetail, setCompanyDetail] = useState({
    company: "",
    // startedDate: '',
    phone:'',
    about: "",
    headline: "",
    image: "",
    peoples: "",
    address: "",
  });

  const [changedData, setChangedData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()
  const token = useSelector((state) => {
    return state?.companyDetails.companyToken
  });

  const handleProfileEditSuccess = async (e) => {
 
    console.log(changedData,"changedData");
    console.log(token,"tokenttt");
    await Axios.post(`${CompanyApi}EditCompanyProfile`, {
      data: changedData,
      token: token,
    }).then((res) => {
      toast.success("Profile updated!", {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#B00043',
          color: '#fff',
        },
      });
    });
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await Axios.get(
          `${CompanyApi}companyProfile?data=${encodeURIComponent(token)}`
        ).then((res) => {
          setCompanyDetail(res.data.companyData);
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [token]);

  const handleFieldChange = (fieldName, value) => {
    console.log(fieldName,value,"popiyj");
      setChangedData({ ...changedData, [fieldName]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-pink-50">
      <div className="w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(handleProfileEditSuccess)}>
        <h2 className="text-center text-2xl mb-4 text-gray-800">
          Edit Profile!
        </h2>
        <fieldset className="pb-4">
          <ul>
            <li className="grid gap-2">
              <label htmlFor="company" className="text-left">
                Company name:
              </label>
              <input
                {...register("company", {
                  pattern: /^[^\s]+$/,
                })}
                defaultValue={companyDetail.company ?? ''}
                type="text"
                id="company"
                className="px-3 py-2 border rounded-lg w-full"
                onChange={(e) => handleFieldChange("company", e.target.value)} 
              />
              {errors.company && errors.company.type === "required" && (
                <label className="text-sm text-red-600">
                  Please enter your company name
                </label>
              )}
              {errors.company && errors.company.type === "pattern" && (
                <label className="text-sm text-red-600">
                  Please enter a valid company name
                </label>
              )}
            </li>
            <li className="grid gap-2">
              <label htmlFor="headline" className="text-left">
                {" "}
                Headline
              </label>
              <input
                {...register("headline", {
                  pattern: /^.{2,56}$/,
                })}
                defaultValue={companyDetail.headline ?? ''}
                type="text"
                id="headline"
                className="px-3 py-2 border rounded-lg w-full"
                onChange={(e) => handleFieldChange("headline", e.target.value)} 
              />
              {errors.headline && errors.headline.type === "required" && (
                <label className="text-sm text-red-600">
                  Please enter the headline
                </label>
              )}
              {errors.headline && errors.headline.type === "pattern" && (
                <label className="text-sm text-red-600">
                  Please enter a valid headline (maximum 56 characters)
                </label>
              )}
            </li>
            <li className="grid gap-2">
              <label htmlFor="about" className="text-left">
                About:
              </label>
              <input
                {...register("about", { pattern: /^.{1,180}$/ })}
                defaultValue={companyDetail.about ?? ''}
                type="text"
                id="about"
                required
                className="px-3 py-2 border rounded-lg w-full"
                onChange={(e) => handleFieldChange("about", e.target.value)} 
              />
              {errors.about && errors.about.type === "pattern" && (
                <label className="text-sm text-red-600">
                  Please enter a valid headline (maximum 180 characters)
                </label>
              )}
            </li>
            {companyDetail.address
                ? companyDetail.address.map((data) => (
                <li className="grid gap-2 mt-8">
                  <label
                    htmlFor="address"
                    className="text-center mb-2 text-xl text-black"
                  >
                    Address:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="building">Building:</label>
                      <input
                        {...register("address.building", {
                          required: true,
                        })}
                        defaultValue={data.building}
                        type="text"
                        id="building"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.building && (
                        <label className="text-sm text-red-600">
                          Please enter the building
                        </label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city">City:</label>
                      <input
                        {...register("address.city", {
                          required: true,
                        })}
                        defaultValue={data.city}
                        type="text"
                        id="city"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.city && (
                        <label className="text-sm text-red-600">
                          Please enter the city
                        </label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="pin">Pin:</label>
                      <input
                        {...register("address.pin", {
                          required: true,
                          pattern: /^[0-9]{6}$/, // Assumes a 6-digit pin code format
                        })}
                        defaultValue={data.pin}
                        type="text"
                        id="pin"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.pin &&
                        errors.address.pin.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the pin code
                          </label>
                        )}
                      {errors.address?.pin &&
                        errors.address.pin.type === "pattern" && (
                          <label className="text-sm text-red-600">
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
                        defaultValue={data.district}
                        type="text"
                        id="district"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.district && (
                        <label className="text-sm text-red-600">
                          Please enter the district
                        </label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state">State:</label>
                      <input
                        {...register("address.state", {
                          required: true,
                        })}
                        defaultValue={data.state}
                        type="text"
                        id="state"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.address?.state && (
                        <label className="text-sm text-red-600">
                          Please enter the state
                        </label>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-left">
                        Contact No:
                      </label>
                      <input
                        {...register("phone", {
                          required: true,
                          pattern: /^[0-9]{10}$/,
                        })}
                        defaultValue={data.phone}
                        type="tel"
                        id="phone"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.phone && errors.phone.type === "required" && (
                        <label className="text-sm text-red-600">
                          Please enter your phone number
                        </label>
                      )}
                      {errors.phone && errors.phone.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter a valid 10-digit phone number
                        </label>
                      )}
                    </div>
                  </div>
                </li>
             ))
             : ""}
          </ul>
        </fieldset>
        <button className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">
          Submit
        </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
