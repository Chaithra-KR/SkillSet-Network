import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CompanyApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Button } from "antd";
import { Image } from "cloudinary-react";
import { companyDetails } from "../../Store/storeSlices/companyAuth";
import { companyAxiosInstance } from "../../configs/axios/axios";
import axios from "axios";

const EditProfile = () => {
  const [companyDetail, setCompanyDetail] = useState({
    company: "",
    phone: "",
    about: "",
    headline: "",
    image: "",
    peoples: "",
    address: "",
  });

  const [changedData, setChangedData] = useState({});
  const [imageSelect, setImageSelect] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  const validateImageType = (file) => {
    if (!file) {
      return false;
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    return validImageTypes.includes(file.type);
  };


  const handleProfileEditSuccess = async (e) => {
    changedData.image = profilePic;
    await axios
      .post(`${CompanyApi}EditCompanyProfile`, {
        data: changedData,
        token: token,
      })
      .then((res) => {
        toast.success("Profile updated!", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
      });
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await axios
          .get(`${CompanyApi}companyProfile?data=${encodeURIComponent(token)}`)
          .then((res) => {
            setCompanyDetail(res.data.companyData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [token]);

  const handleFieldChange = (fieldName, value) => {
    console.log(fieldName, value, "popiyj");
    setChangedData({ ...changedData, [fieldName]: value });
  };

  const handleUpload = async () => {
    if (!imageSelect) {
      console.error("No image selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageSelect);
      formData.append("upload_preset", "profile");

      const response = await companyAxiosInstance.post(
        `https://api.cloudinary.com/v1_1/skillsetnetwork/image/upload`,
        formData
      );

      setProfilePic(response.data.secure_url);

      message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Error uploading image");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center pb-7 bg-gray-50">
        <div className="w-full max-w-4xl p-4 mt-4 mb-4 bg-white bg-opacity-90 rounded-lg shadow-md">
          <h2 className="text-center text-2xl mb-4 text-gray-800">
            Edit Profile!
          </h2>
          <div className="w-36 h-36 mx-auto mt-10 square-full overflow-hidden">
            {profilePic ? (
              <Image
                cloudName="skillsetnetwork"
                publicId={profilePic}
                width="auto"
                height="150"
                crop="scale"
                alt="Profile"
              />
            ) : (
              <img src={companyDetail.image} alt="" />
            )}
          </div>
          <div className="mb-4">
            
            <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const selectedFile = event.target.files[0];
                    if (validateImageType(selectedFile)) {
                      setImageSelect(selectedFile);
                    } else {
                      toast.error(
                        "Please select a valid image file (e.g., JPG, PNG)."
                      );
                    }
                  }}
                  id="fileInput"
                  accept="image/*"
                />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-pink-400 p-2 text-sm rounded-lg text-white"
            >
              Select Image
            </label>
            <Button className="ml-2" onClick={handleUpload}>
              Upload
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleProfileEditSuccess)}>
            <fieldset>
              <ul>
                <li className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="company" className="text-left">
                        Company name:
                      </label>
                      <input
                        {...register("company", {
                          pattern: /^[^\s]+$/,
                        })}
                        defaultValue={companyDetail.company ?? ""}
                        type="text"
                        id="company"
                        className="px-3 py-2 border rounded-lg w-full"
                        onChange={(e) =>
                          handleFieldChange("company", e.target.value)
                        }
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
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="headline" className="text-left">
                        {" "}
                        Headline
                      </label>
                      <input
                        {...register("headline", {
                          pattern: /^.{2,56}$/,
                        })}
                        defaultValue={companyDetail.headline ?? ""}
                        type="text"
                        id="headline"
                        className="px-3 py-2 border rounded-lg w-full"
                        onChange={(e) =>
                          handleFieldChange("headline", e.target.value)
                        }
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
                  </div>
                </li>

                <li className="grid gap-2 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="about" className="text-left">
                        About:
                      </label>
                      <textarea
                        {...register("about", { pattern: /^.{1,180}$/ })}
                        type="text"
                        id="about"
                        defaultValue={companyDetail.about ?? ""}
                        className="px-3 py-2 border h-24 rounded-lg w-full"
                        onChange={(e) =>
                          handleFieldChange("about", e.target.value)
                        }
                      ></textarea>

                      {errors.about && errors.about.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter a valid about (maximum 180 characters)
                        </label>
                      )}
                    </div>
                  </div>
                </li>

                {companyDetail.address
                  ? companyDetail.address.map((data) => (
                      <>
                        <li className="grid gap-2 mt-8">
                          <label
                            htmlFor="location"
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
                              {errors.phone &&
                                errors.phone.type === "required" && (
                                  <label className="text-sm text-red-600">
                                    Please enter your phone number
                                  </label>
                                )}
                              {errors.phone &&
                                errors.phone.type === "pattern" && (
                                  <label className="text-sm text-red-600">
                                    Please enter a valid 10-digit phone number
                                  </label>
                                )}
                            </div>
                          </div>
                        </li>
                      </>
                    ))
                  : ""}
              </ul>
            </fieldset>
            <button className="px-4 py-2 mt-3 border w-full rounded-lg shadow bg-gray-300 hover:bg-pink-600 hover:border-gray-300">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
