import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserApi } from "../../configs/api";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMoneyBillAlt,
  FaClock,
  FaMapMarker,
} from "react-icons/fa";
import { Button, Modal } from "antd";
import { BsBookmark } from "react-icons/bs";
import { TbTargetArrow, TbTargetOff } from "react-icons/tb";

const SavedJobs = () => {
  const [jobData, setJobData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  const seeker = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleApplyJob = (jobId) => {
    navigate(`/apply-job?jobId=${jobId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${UserApi}savedJobs?data=${encodeURIComponent(seeker)}`
        );
        const jobData = response.data.jobData;
        setJobData(jobData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, []);

  const handleHomeView = () => {
    navigate("/home");
  };

  const handleJobView = () => {
    navigate("/jobView");
  };

  return (
    <div className="bg-gray-100 h-screen w-full flex flex-wrap justify-between p-5">
      <div className="mt-5 w-full md:w-2/3 lg:w-3/4">
        <h2 className="text-lg font-bold mb-2 text-center">Saved jobs</h2>

        <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
          {jobData.length !== 0
            ? jobData.map((val, i) => (
                <li key={i} className="w-full md:w-1/3 mb-4">
                  <div className="box mb-4 p-4 text-center shadow-md bg-white">
                    <div className="job-card">
                      <div className="job-card-header flex items-center">
                        {val.company.image ? (
                          <img
                            className="rounded-full w-20 h-20 border-persian-orange p-2"
                            src={val.company.image}
                            alt="user"
                          />
                        ) : (
                          <img
                            className="rounded-full w-20 h-20 border-persian-orange p-2"
                            src="./profile.png"
                            alt="user"
                          />
                        )}
                      </div>

                      <div className="job-card-title font-semibold text-lg">
                        {val.position}
                      </div>
                      <span className="text-sm">
                        at{" "}
                        <span className="font-bold">
                          {" "}
                          {val.company.company}
                        </span>
                      </span>
                      <div className="job-card-subtitle text-gray-500 px-4">
                        <p className="italic mb-1">
                          Required skills are{" "}
                          {val.skills.slice(0, 2).map((skill, i) => (
                            <span key={i}>
                              {skill}
                              {i < 1 && i < val.skills.length - 1 ? ", " : ""}
                            </span>
                          ))}
                          {val.skills.length > 3 && <span> ...</span>}
                        </p>
                      </div>
                      <div className="job-detail-buttons mt-4 space-x-2 flex">
                        <button className="w-28 text-xs sm:text-base bg-gray-100 text-pink-600 hover:bg-gray-200 hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                          {val.time}
                        </button>
                        <button className="w-28 text-xs sm:text-base bg-gray-100 text-pink-600 hover:bg-gray-200 hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                          Rs {val.salary}/-
                        </button>
                        <button className=" text-xs sm:text-base flex items-center bg-gray-100 text-pink-600 hover:bg-gray-200 hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                          <TbTargetArrow className=" mx-1" />
                          Recruiting
                        </button>
                      </div>
                      <div className="job-card-buttons mt-4 flex justify-between items-center sm:mx-14">
                        <button
                          onClick={() => {
                            handleApplyJob(val._id);
                          }}
                          className="bg-pink-400 text-xs sm:text-base hover:bg-pink-500 text-white px-3 py-2 sm:py-1 mt-2 rounded-md "
                          type="pink"
                        >
                          Apply now
                        </button>
                        <Button
                          className="bg-pink-300 text-xs sm:text-base text-white mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                          type="pink"
                          onClick={() => openModal(val)}
                        >
                          View details
                        </Button>
                        <Modal
                          title="About the vacancy"
                          open={selectedJob === val}
                          footer={null}
                          onCancel={closeModal}
                        >
                          <h1 className="text-xl font-bold pb-3">
                            {val.position}{" "}
                            <span className="text-sm">
                              ( {val.company.company} )
                            </span>
                          </h1>
                          <div className="mb-3">
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaClock />
                              </span>
                              <p>{val.time}</p>
                            </div>
                            {val.company.address.map((value) => (
                              <div key={value.pin}>
                                <div className="flex items-center">
                                  <span className="w-8 font-bold">
                                    <FaMapMarker />
                                  </span>
                                  <p>
                                    {value.building}, {value.city},{" "}
                                    {value.district}, {value.state}, {value.pin}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-8 font-bold">
                                    <FaPhone />
                                  </span>
                                  <p>{value.phone}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaEnvelope />
                              </span>
                              <p>{val.company.email}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaMoneyBillAlt />
                              </span>
                              <p>Rs {val.salary}/-</p>
                            </div>
                          </div>
                          <p>
                            <span className="font-bold">
                              Required skills :{" "}
                            </span>
                            {val.skills.map((skill, i) => (
                              <span key={i}>
                                {skill}
                                {val.skills.length - 1 === i ? "" : ", "}
                              </span>
                            ))}
                          </p>
                          <p className="text-pink-500">
                            {val.skills.length} skills match your profile - you
                            may be a good fit
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
                    </div>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </div>

      <div className="mt-5 w-full md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded p-4 shadow-md mb-4">
          <div className="flex justify-between items-center">
            <h4>The total amount saved jobs :</h4>
            <p className="pl-2">{jobData.length}</p>
          </div>
          <div className="mt-2">
            <button
              onClick={handleHomeView}
              className="w-full bg-pink-500 rounded px-3 py-2 text-white"
            >
              Go To Home
            </button>
          </div>
        </div>

        <div className="bg-white rounded p-4 shadow-md">
          <div className="flex justify-between items-center">
            <p>
              Apply job now!{" "}
              <button
                onClick={handleJobView}
                className="w-20 ml-3 bg-pink-500 rounded text-white"
              >
                Job list
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
