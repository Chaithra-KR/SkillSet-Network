import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { UserApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import { Image } from "cloudinary-react";
import { Button } from "antd";
import axios from "axios";

const EditProfile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    headline: "",
    about: "",
    location: "",
    email: "",
    skills: "",
    dob: "",
    image: "",
    phone: "",
    cv: "",
    experience: "",
  });

  const [skills, setSkills] = useState([]);
  const [editingSkillIndex, setEditingSkillIndex] = useState("");
  const [changedData, setChangedData] = useState({});
  const [imageSelect, setImageSelect] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");

  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = useSelector((state) => state?.seekerDetails.seekerToken);

  // Function to add a skill to the list
  const addSkill = () => {
    const skillInput = document.getElementById("skill-input");
    const skillText = skillInput.value.trim();
    if (skillText) {
      setSkills([...skills, skillText]);
      skillInput.value = "";
    }
  };

  // Function to remove a skill from the list
  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  // Function to handle editing a skill
  const handleEdit = (index) => {
    setEditingSkillIndex(index);
  };

  // Function to save edited skill
  const handleSaveEdit = (index, newValue) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = newValue;
    setSkills(updatedSkills);
    setEditingSkillIndex(-1); // Reset editing index
  };

  // Function to handle file change for image and CV
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "application/pdf") {
        setCvFile(file);
        setCvFileName(file.name);
      }
    }
  };
  const validateImageType = (file) => {
    if (!file) {
      return false;
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    return validImageTypes.includes(file.type);
  };

  // Function to upload profile image to Cloudinary
  const handleUploadImage = async () => {
    if (!imageSelect) {
      console.error("No image selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageSelect);
      formData.append("upload_preset", "profile");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/skillsetnetwork/image/upload`,
        formData
      );

      if (response.data && response.data.secure_url) {
        setChangedData((prevData) => ({
          ...prevData,
          image: response.data.secure_url, // Use a different key than 'cv'
        }));

        toast.success("Profile image uploaded successfully");
      } else {
        console.error("Error uploading image: Invalid response");
        toast.error("Error uploading image: Invalid response");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  // Function to upload CV to Cloudinary
  const handleUploadCV = async () => {
    if (!cvFile) {
      console.error("No CV file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", cvFile);
      formData.append("upload_preset", "cvfiles");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/skillsetnetwork/image/upload`,
        formData
      );

      if (response.data && response.data.secure_url) {
        // CV uploaded successfully
        setChangedData((prevData) => ({
          ...prevData,
          cv: response.data.secure_url,
        }));
        toast.success("CV uploaded successfully");
      } else {
        console.error("Error uploading CV: Invalid response");
        toast.error("Error uploading CV: Invalid response");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Error uploading CV");
    }
  };

  // Function to handle profile edit success
  const handleProfileEditSuccess = async () => {
    changedData.skills = skills;

    const response = await Axios.post(`${UserApi}EditUserProfile`, {
      data: changedData,
      token: token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Profile updated!", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#B00043",
        color: "#fff",
      },
    });
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        if (location.state && location.state.userDetails) {
          setUserDetails(location.state.userDetails);
        }
        const response = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(token)}`
        );
        setUserDetails(response.data.seekerData);
        setSkills(response.data.seekerData.skills);
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [token, location.state]);

  // Function to handle changes to fields
  const handleFieldChange = (fieldName, value) => {
    setChangedData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-pink-50">
      <div className="w-full max-w-4xl p-4 mt-4 bg-white bg-opacity-90 rounded-lg shadow-md">
        <h2 className="text-center text-2xl mb-4 text-gray-800">
          Edit Profile!
        </h2>
        <div className="w-36 h-36 mx-auto mt-10 rounded-full overflow-hidden">
          {changedData.image ? (
            <Image
              cloudName="skillsetnetwork"
              publicId={changedData.image}
              width="auto"
              height="150"
              crop="scale"
              alt="Profile"
            />
          ) : (
            <img src={userDetails.image || "/profile.png"} alt="default" />
          )}
        </div>

        <ul className="mt-4 mb-3">
          <li className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
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
                  className="cursor-pointer w-full border p-1 sm:p-2 text-xs sm:text-sm rounded-lg text-black"
                >
                  Select Image
                </label>
                <Button
                  className="ml-2 bg-pink-400 p-1 sm:p-2 text-xs sm:text-sm text-white"
                  onClick={handleUploadImage}
                >
                  Upload
                </Button>
              </div>
              <div className="col-span-1">
                <div className="flex items-center">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    id="cv"
                    accept=".pdf"
                  />
                  <label
                    htmlFor="cv"
                    className="cursor-pointer w-full border p-1 sm:p-2 text-xs sm:text-sm rounded-lg text-black"
                  >
                    {cvFileName ? cvFileName : "Select your CV"}{" "}
                  </label>
                  <Button
                    className="ml-2 bg-pink-400 p-1 sm:p-2 text-xs sm:text-sm text-white"
                    onClick={handleUploadCV}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <form onSubmit={handleSubmit(handleProfileEditSuccess)}>
          <fieldset>
            <ul>
              <li className="grid gap-2 text-sm md:text-base">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="username" className="text-left">
                      Username:
                    </label>
                    <input
                      {...register("username", {
                        pattern: /^[^\s]+$/,
                      })}
                      defaultValue={userDetails.username ?? ""}
                      type="text"
                      id="username"
                      className="px-3 py-2 border rounded-lg w-full"
                      onChange={(e) =>
                        handleFieldChange("username", e.target.value)
                      }
                    />
                    {errors.username && errors.username.type === "required" && (
                      <p className="text-sm text-red-600">
                        Please enter the username
                      </p>
                    )}
                    {errors.username && errors.username.type === "pattern" && (
                      <p className="text-sm text-red-600">
                        Please enter valid username
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="headline" className="text-left">
                      Headline:
                    </label>
                    <input
                      {...register("headline", {
                        pattern: /^.{2,56}$/,
                      })}
                      type="text"
                      defaultValue={userDetails.headline ?? ""}
                      id="headline"
                      className="px-3 py-2 border rounded-lg w-full"
                      onChange={(e) =>
                        handleFieldChange("headline", e.target.value)
                      }
                    />
                    {errors.headline && errors.headline.type === "required" && (
                      <p className="text-sm text-red-600">
                        Please enter the headline
                      </p>
                    )}
                    {errors.headline && errors.headline.type === "pattern" && (
                      <p className="text-sm text-red-600">
                        Please enter a valid headline (maximum 56 characters)
                      </p>
                    )}
                  </div>
                </div>
              </li>

              <li className="grid gap-2 mt-3 text-sm md:text-base">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="experience" className="text-left">
                      Experience:
                    </label>
                    <textarea
                      {...register("experience", { pattern: /^.{1,180}$/ })}
                      type="text"
                      id="experience"
                      defaultValue={userDetails.experience ?? ""}
                      className="px-3 py-2 h-32 border rounded-lg w-full"
                      onChange={(e) =>
                        handleFieldChange("experience", e.target.value)
                      }
                    ></textarea>
                    {errors.experience &&
                      errors.experience.type === "pattern" && (
                        <p className="text-sm text-red-600">
                          Please enter a valid experience (maximum 180
                          characters)
                        </p>
                      )}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="about" className="text-left">
                      About:
                    </label>
                    <textarea
                      {...register("about", { pattern: /^.{1,180}$/ })}
                      type="text"
                      id="about"
                      defaultValue={userDetails.about ?? ""}
                      className="px-3 py-2 border h-32 rounded-lg w-full"
                      onChange={(e) =>
                        handleFieldChange("about", e.target.value)
                      }
                    ></textarea>

                    {errors.about && errors.about.type === "pattern" && (
                      <p className="text-sm text-red-600">
                        Please enter a valid about (maximum 180 characters)
                      </p>
                    )}
                  </div>
                </div>
              </li>

              <li className="grid gap-2 mt-3 text-sm md:text-base">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="skills" className="text-left">
                      Skills:
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="skill-input"
                        placeholder="Add a skill"
                        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="rounded-full flex items-center justify-center bg-pink-300 hover:bg-pink-600 text-white font-medium ml-1 px-3 py-1"
                      >
                        <i className="fa-solid fa-plus text-2xl">+</i>
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="m-1 p-2 bg-gray-200 text-black rounded-full h-6 text-xs md:text-sm flex items-center"
                        >
                          {editingSkillIndex === index ? (
                            <>
                              <input
                                type="text"
                                defaultValue={skill}
                                onBlur={(e) =>
                                  handleSaveEdit(index, e.target.value)
                                }
                              />
                            </>
                          ) : (
                            <>
                              <span className="pb-1 pr-2">{skill}</span>
                              <TiDeleteOutline
                                onClick={() => removeSkill(index)}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "17px",
                                  color: "gray",
                                }}
                                title="Remove"
                              />
                              <TiEdit
                                onClick={() => handleEdit(index)}
                                style={{
                                  cursor: "pointer",
                                  color: "gray",
                                }}
                                className="ml-1"
                                title="Edit"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              {userDetails.location
                ? userDetails.location.map((data, i) => (
                    <div key={i}>
                      <li className="grid gap-2 mt-8 text-sm md:text-base">
                        <h5
                          htmlFor="location"
                          className="text-center mb-2 text-xl text-black"
                        >
                          Location:
                        </h5>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor="city">City:</label>
                            <input
                              {...register("location.city", {
                                required: true,
                              })}
                              type="text"
                              id="city"
                              defaultValue={data.city}
                              className="px-3 py-2 border rounded-lg w-full"
                              onChange={(e) =>
                                handleFieldChange("city", e.target.value)
                              }
                            />
                            {errors.location?.city && (
                              <p className="text-sm text-red-600">
                                Please enter the city
                              </p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="district">District:</label>
                            <input
                              {...register("location.district", {
                                required: true,
                              })}
                              type="text"
                              id="district"
                              defaultValue={data.district}
                              className="px-3 py-2 border rounded-lg w-full"
                              onChange={(e) =>
                                handleFieldChange("district", e.target.value)
                              }
                            />
                            {errors.location?.district && (
                              <p className="text-sm text-red-600">
                                Please enter the district
                              </p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="state">State:</label>
                            <input
                              {...register("location.state", {
                                required: true,
                              })}
                              defaultValue={data.state}
                              type="text"
                              id="state"
                              className="px-3 py-2 border rounded-lg w-full"
                              onChange={(e) =>
                                handleFieldChange("state", e.target.value)
                              }
                            />
                            {errors.location?.state && (
                              <p className="text-sm text-red-600">
                                Please enter the state
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    </div>
                  ))
                : ""}
            </ul>
          </fieldset>
          <button className="px-4 py-2 mt-3 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
