import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { CompanyApi } from "../../configs/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";
import { companyAxiosInstance } from "../../configs/axios/axios";
import { Button, Modal } from "antd";
import {
  FaPhone,
  FaEnvelope,
  FaMoneyBillAlt,
  FaClock,
  FaMapMarker,
} from "react-icons/fa";
import axios from "axios";

const JobPosting = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [jobList, setJobList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobPosition, setJobPosition] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  const { companyName, companyToken } = useSelector((state) => ({
    companyToken: state?.companyDetails.companyToken,
    companyName: state?.companyDetails.companyName,
  }));

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const addSkill = () => {
    const skillInput = document.getElementById("skill-input");
    const skillText = skillInput.value.trim();
    if (skillText) {
      setSkills([...skills, skillText]);
      skillInput.value = "";
      skillInput.focus();
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleJobPosts = async (data) => {
    try {
      data.skills = skills;
      const res = await axios.post(`${CompanyApi}JobPosting`, {
        data: data,
        company: companyToken,
      });
      if (res.data.status) {
        toast.success(res.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
        navigate("/company/central-hub");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        const response = await axios.get(
          `${CompanyApi}JobDetails?data=${encodeURIComponent(companyToken)}`
        );
        let companyData = response.data.companyData;
        const data = companyData.jobs;
        setJobList(data);
        let jobPosition = response.data.jobPosition;
        setJobPosition(jobPosition);
      } catch (error) {
        console.log(error);
      }
    };
    handleJobDetails();
  }, []);

  return (
    <div className="w-full pb-7 mx-auto px-4">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 lg:w-6/12 flex justify-center p-4">
          <form
            onSubmit={handleSubmit(handleJobPosts)}
            className="bg-gray-50 p-5 rounded"
          >
            <h2 className="text-center text-2xl mb-4 mt-10 text-gray-800">
              Post New Job!
            </h2>
            <fieldset>
              <ul>
                <li className="grid gap-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="position" className="text-left">
                        Job Position:
                      </label>
                      <select
                        {...register("position", {
                          required: "Please select a job!",
                        })}
                        id="position"
                        className="px-3 py-2 border rounded-lg w-full"
                      >
                        <option value="">Select Job</option>
                        {jobPosition.map((job) => (
                          <option key={job._id} value={job._id}>
                            {job.position}
                          </option>
                        ))}
                      </select>
                      {errors.position && (
                        <label className="text-sm text-red-600">
                          {errors.position.message}
                        </label>
                      )}
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="salary" className="text-left">
                        Salary:
                      </label>
                      <input
                        {...register("salary", {
                          pattern: /^[0-9]+(\.[0-9]+)?$/,
                          required: true,
                        })}
                        type="text"
                        id="salary"
                        className="px-3 py-2 border rounded-lg w-full"
                      />
                      {errors.salary && errors.salary.type === "required" && (
                        <label className="text-sm text-red-600">
                          Please enter the salary
                        </label>
                      )}
                      {errors.salary && errors.salary.type === "pattern" && (
                        <label className="text-sm text-red-600">
                          Please enter a valid salary (maximum 56 characters)
                        </label>
                      )}
                    </div>
                  </div>
                </li>

                <li className="grid gap-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="time" className="text-left">
                        Job Time:
                      </label>
                      <select
                        {...register("time", {
                          required: "Please select a job time",
                        })}
                        id="time"
                        className="px-3 py-2 border rounded-lg w-full"
                      >
                        <option value="">Select Job Time</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                      </select>
                      {errors.time && (
                        <label className="text-sm text-red-600">
                          {errors.time.message}
                        </label>
                      )}
                    </div>
                  </div>
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
                        class="rounded-full flex items-center justify-center bg-pink-300 hover:bg-pink-500 text-white font-medium ml-1 px-3 py-1"
                      >
                        <i class="fa-solid fa-plus text-2xl">+</i>
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap">
                      {skills.map((skill, index) => (
                        <div className="m-1 p-2 bg-gray-200 text-black rounded-full h-6 text-sm flex items-center">
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
                          </>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="grid gap-2 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="col-span-1">
                      <label htmlFor="requirements" className="text-left">
                        Requirements:
                      </label>
                      <textarea
                        {...register("requirements", {
                          pattern: /^.{1,250}$/,
                          required: true,
                        })}
                        type="text"
                        id="requirements"
                        className="px-3 py-2 h-32 border rounded-lg w-full"
                      ></textarea>
                      {errors.requirements &&
                        errors.requirements.type === "pattern" && (
                          <label className="text-sm text-red-600">
                            Please enter a valid requirements (maximum 250
                            characters)
                          </label>
                        )}
                      {errors.requirements &&
                        errors.requirements.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the requirements
                          </label>
                        )}
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="description" className="text-left">
                        Description:
                      </label>
                      <textarea
                        {...register("description", {
                          required: true,
                          pattern: /^.{1,250}$/,
                        })}
                        type="text"
                        id="description"
                        className="px-3 py-2 border h-32 rounded-lg w-full"
                      ></textarea>

                      {errors.description &&
                        errors.description.type === "pattern" && (
                          <label className="text-sm text-red-600">
                            Please enter a valid description (maximum 250
                            characters)
                          </label>
                        )}
                      {errors.description &&  
                        errors.description.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the description
                          </label>
                        )}
                    </div>
                  </div>
                </li>
              </ul>
            </fieldset>
            <button className="px-4 py-2 mt-3 border w-full text-white rounded-lg shadow bg-pink-300 hover:bg-pink-500 hover:border-gray-300">
              Post
            </button>
          </form>
        </div>
        <div className="w-full md:w-1/2 lg:w-5/12 p-4 mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold">Jobs</h2>
          <ul className="mt-2 flex flex-wrap h-[500px] overflow-y-auto ">
            {jobList.map((val, i) => (
              <li className="w-full md:w-1/2" key={i}>
                <div className="box mb-4 p-4 text-center shadow-md">
                  <div className="bg-gray-50 h-32 mb-2">
                    <div>
                      <h4>Skills :</h4>
                      <p>
                        {val.skills.map((skill, i) => (
                          <>
                            {skill}
                            {val.skills.length - 1 === i ? "" : ", "}
                          </>
                        ))}
                      </p>
                      <p className="price text-xl font-semibold">{val.time}</p>
                      <p className="price text-xl pt-1 font-semibold">
                        Salary: Rs.{val.salary}/-
                      </p>
                    </div>
                  </div>
                  <h3 className="title text-lg font-semibold">
                    {val.position}
                  </h3>

                  <Button
                    className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                    type="pink"
                    onClick={() => openModal(val)}
                  >
                    View
                  </Button>
                  <Modal
                    title="About the vacancy"
                    visible={selectedJob === val}
                    footer={null}
                    onCancel={closeModal}
                  >
                    <h1 className="text-xl font-bold pb-3">
                      {val.position}{" "}
                      <span className="text-sm">( {companyName} )</span>
                    </h1>
                    <div className="mb-3">
                      <div className="flex items-center">
                        <span className="w-8 font-bold">
                          <FaClock />
                        </span>
                        <p>{val.time}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="w-8 font-bold">
                          <FaMoneyBillAlt />
                        </span>
                        <p>Rs {val.salary}/-</p>
                      </div>
                    </div>
                    <p>
                      <span className="font-bold">Required skills : </span>
                      {val.skills.map((skill, i) => (
                        <>
                          {skill}
                          {val.skills.length - 1 === i ? "" : ", "}
                        </>
                      ))}
                    </p>
                    <div className="mt-3">
                      <h3 className="font-bold">Requirements </h3>
                      <p>{val.requirements}</p>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold">Description </h3>
                      <p>{val.description}</p>
                    </div>
                  </Modal>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobPosting;
