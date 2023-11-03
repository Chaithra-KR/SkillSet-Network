import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "antd";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import axios from "axios";
import { UserApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const JobApply = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkillIndex, setEditingSkillIndex] = useState("");
  const [changedData, setChangedData] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get("jobId");

  const addSkill = () => {
    const skillInput = document.getElementById("skill-input");
    const skillText = skillInput.value.trim();
    if (skillText) {
      setSkills([...skills, skillText]);
      skillInput.value = "";
    }
  };

  // Function to handle editing a skill
  const handleEdit = (index) => {
    setEditingSkillIndex(index);
  };

  // Function to remove a skill from the list
  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
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

  const navigate = useNavigate();
  const token = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const handleJobApplying = async (applyData) => {
    try {
      changedData.skills = skills;
      const requestData = {
        data: { ...changedData, ...applyData, jobId },
        token: token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await axios
        .post(`${UserApi}applyJob`, {
          requestData,
        })
        .then((res) => {
          toast.success(res.data.message, {
            duration: 3000,
            position: "top-center",
            style: {
              background: "#B00043",
              color: "#fff",
            },
          });
          navigate("/jobView");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("/public/applyjob.jpeg")`,
      }}
    >
      <div className="w-full max-w-4xl p-4 mt-4 bg-white bg-opacity-90 rounded-lg shadow-md">
        <h2 className="text-center text-2xl mb-4 text-gray-800">Apply job!</h2>

        <ul className="mt-4 mb-3">
          <li className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <label htmlFor="cv" className="text-left">
                  Your CV:
                </label>
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
                    className="cursor-pointer w-full border p-2 text-sm rounded-lg text-black"
                  >
                    {cvFileName ? cvFileName : "Select your CV"}{" "}
                  </label>
                  <Button
                    className="ml-2 bg-pink-400 text-white"
                    onClick={handleUploadCV}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <form onSubmit={handleSubmit(handleJobApplying)}>
          <fieldset>
            <ul>
              <li className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label htmlFor="name" className="text-left">
                      Name:
                    </label>
                    <input
                      {...register("name", {
                        required: true,
                        pattern: /^[^\s]+$/,
                      })}
                      type="text"
                      id="name"
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                    {errors.name && errors.name.type === "required" && (
                      <label className="text-sm text-red-600">
                        Please enter the name
                      </label>
                    )}
                    {errors.name && errors.name.type === "pattern" && (
                      <label className="text-sm text-red-600">
                        Please enter valid name
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
                      {...register("experience", {
                        pattern: /^.{1,180}$/,
                      })}
                      type="text"
                      id="experience"
                      className="px-3 py-2 h-32 border rounded-lg w-full"
                    ></textarea>
                    {errors.experience &&
                      errors.experience.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter valid experience
                        </label>
                      )}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="coverLetter" className="text-left">
                      Cover letter:
                    </label>
                    <textarea
                      {...register("coverLetter", {
                        required: true,
                        pattern: /^.{1,180}$/,
                      })}
                      type="text"
                      id="coverLetter"
                      className="px-3 py-2 h-32 border rounded-lg w-full"
                    ></textarea>
                    {errors.coverLetter &&
                      errors.coverLetter.type === "required" && (
                        <label className="text-sm text-red-600">
                          Please enter the coverLetter
                        </label>
                      )}
                    {errors.coverLetter &&
                      errors.coverLetter.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter valid coverLetter
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
                  <div className="col-span-1">
                    <label htmlFor="phone" className="text-left">
                      Phone:
                    </label>
                    <input
                      {...register("phone", {
                        required: true,
                        pattern: /^[0-9]{10}$/,
                      })}
                      type="tel"
                      id="phone"
                      className="px-3 py-2 border rounded-lg w-full"
                    />
                    {errors.phone && errors.phone.type === "pattern" && (
                      <label className="text-sm text-red-600">
                        Please enter a valid 10-digit phone number
                      </label>
                    )}
                    {errors.phone && errors.phone.type === "required" && (
                      <label className="text-sm text-red-600">
                        Please enter the phone number
                      </label>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </fieldset>
          <button className="px-4 py-2 mt-5 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApply;
