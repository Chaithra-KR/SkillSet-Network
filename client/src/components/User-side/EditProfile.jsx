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
    cv:"",
    experience: "",
  });

  const [skills, setSkills] = useState([]);
  const [editingSkillIndex, setEditingSkillIndex] = useState("");
  const [changedData, setChangedData] = useState({});
  const [imageSelect, setImageSelect] = useState("");
  const [cvFile, setCvFile] = useState(null);

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
      }
    }
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
        // Profile image uploaded successfully
        // For profile image update
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
      formData.append("upload_preset", "cvfiles"); // Use the appropriate upload preset for CV files

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

    await Axios.post(`${UserApi}EditUserProfile`, {
      data: changedData,
      token: token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
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
        if (location.state && location.state.userDetails) {
          setUserDetails(location.state.userDetails);
        }
        const response = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(token)}`
        ).then((res) => {
          setUserDetails(res.data.seekerData);
          console.log(res.data.seekerData.skills);
          setSkills(res.data.seekerData.skills);
        });
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
        {/* <div className="w-36 h-36 mx-auto mt-10 square-full overflow-hidden">
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
            <img src={userDetails.image} alt="" />
          )}
        </div> */}

            <ul>
              <li className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        setImageSelect(event.target.files[0]);
                      }}
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer bg-pink-400 p-2 text-sm rounded-lg text-white"
                    >
                      Select Image
                    </label>
                    <Button className="ml-2" onClick={handleUploadImage}>
                      Upload
                    </Button>
                  </div>
                  <div className="col-span-1">
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <Button className="ml-2" onClick={handleUploadCV}>
                      Upload
                    </Button>
                  </div>
                </div>
              </li>
            </ul>
        
        
        <form onSubmit={handleSubmit(handleProfileEditSuccess)}>
          <fieldset>
            <ul>
              <li className="grid gap-2">
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
                    {errors.headline &&
                      errors.headline.type === "required" && (
                        <label className="text-sm text-red-600">
                          Please enter the headline
                        </label>
                      )}
                    {errors.headline &&
                      errors.headline.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter a valid headline (maximum 56 characters)
                        </label>
                      )}
                  </div>
                </div>
              </li>

              <li className="grid gap-2 mt-3">
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
                        <label className="text-sm text-red-600">
                          Please enter a valid experience (maximum 180 characters)
                        </label>
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

                    {errors.about &&
                      errors.about.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter a valid about (maximum 180 characters)
                        </label>
                      )}
                  </div>
                </div>
              </li>

              <li className="grid gap-2 mt-3">
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
                          className="m-1 p-2 bg-gray-200 text-black rounded-full h-6 text-sm flex items-center"
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
                ? userDetails.location.map((data) => (
                    <>
                      <li className="grid gap-2 mt-8">
                        <label
                          htmlFor="location"
                          className="text-center mb-2 text-xl text-black"
                        >
                          Location:
                        </label>

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
                              <label className="text-sm text-red-600">
                                Please enter the city
                              </label>
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
                              <label className="text-sm text-red-600">
                                Please enter the district
                              </label>
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
                              <label className="text-sm text-red-600">
                                Please enter the state
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
          <button className="px-4 py-2 mt-3 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
