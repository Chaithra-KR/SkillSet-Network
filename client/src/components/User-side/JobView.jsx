import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserApi } from "../../configs/api";
import { Button, Modal } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMoneyBillAlt,
  FaClock,
  FaMapMarker,
} from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { TbTargetArrow, TbTargetOff } from "react-icons/tb";
import { useSelector } from "react-redux";
import UserLoading from "../Loading/UserLoadings/UserLoading";

const JobView = () => {
  const [jobs, setJobs] = useState([]);
  const [jobPosition, setJobPosition] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [filterByJob, setFilterByJob] = useState("");
  const [showAppliedJobs, setShowAppliedJobs] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [paginationCount, setPaginationCount] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const seeker = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${UserApi}jobView?data=${encodeURIComponent(
            seeker
          )}&page=${page}&perPage=${perPage}`
        );
        const jobData = response.data.jobs;
        setJobs(jobData);
        setFilteredJobs(jobData);
        setMatchedJobs(response.data.matchedJobs);
        setJobPosition(response.data.jobPosition);
        setTotalCount(response.data.totalCount);
        setPaginationCount(response.data.paginationCount);
        setAppliedJobs(response.data.appliedJobs);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, [seeker, page, perPage]);

  const isSearching = searchQuery !== "";

  const handleApplyJob = (jobId) => {
    navigate(`/apply-job?jobId=${jobId}`);
  };
  const handleSaveJob = async (job) => {
    try {
      const response = await axios.post(`${UserApi}saveJob`, {
        data: job,
        token: seeker,
      });
      toast.success(response.data.message, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#B00043",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const regex = new RegExp(query, "i");
    const filtered = query
      ? jobs.filter(
          (job) => regex.test(job.position) || regex.test(job.company.company)
        )
      : jobs;

    setFilteredJobs(filtered);
  };

  const handleFilterByJob = (event) => {
    const query = event.target.value;
    setFilterByJob(query);

    const filteredByJob = query
      ? jobs.filter((job) => job.position === query)
      : jobs;

    setFilteredJobs(filteredByJob);
  };

  return (
    <>
      {isLoading ? (
        <UserLoading />
      ) : (
        <div className="w-full bg-gray-50 py-4">
          {showAppliedJobs ? (
            <section>
              <button
                onClick={() => {
                  setShowAppliedJobs(false);
                }}
                className="bg-pink-500 text-white px-4 py-2 my-4 mx-10 rounded-lg"
              >
                Back to jobs!
              </button>
              {appliedJobs && appliedJobs.length > 0 ? (
                <div>
                  <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
                    {appliedJobs.map((val, i) => (
                      <li key={i} className="w-full md:w-1/4 ">
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
                              <div className=" mb-10 rounded-full ml-auto mr-2">
                                <button
                                  onClick={() => {
                                    handleSaveJob(val);
                                  }}
                                  className="text-xs text-white border border-transparent bg-pink-400 rounded flex px-2 py-1 flex-raw items-center justify-center"
                                >
                                  <BsBookmark className="fill-current bg-pink-400 text-white mx-1" />
                                  Save
                                </button>
                              </div>
                            </div>

                            <div className="job-card-title font-semibold text-lg">
                              {val.job.position}
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
                                    {i < 1 && i < val.skills.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                                {val.skills.length > 3 && <span> ...</span>}
                              </p>
                            </div>
                            <div className="job-detail-buttons mt-4 space-x-2 flex">
                              <button className="w-28 text-xs sm:text-base bg-gray-100 text-pink-600 hover:bg-gray-200 hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                                {val.job.time}
                              </button>
                              <button className="w-28 text-xs sm:text-base bg-gray-100 text-pink-600 hover:bg-gray-200 hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                                Rs {val.job.salary}/-
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
                                  {val.job.position}{" "}
                                  <span className="text-sm">
                                    ( {val.company.company} )
                                  </span>
                                </h1>
                                <div className="mb-3">
                                  <div className="flex items-center">
                                    <span className="w-8 font-bold">
                                      <FaClock />
                                    </span>
                                    <p>{val.job.time}</p>
                                  </div>
                                  {val.company.address.map((value) => (
                                    <div key={value.pin}>
                                      <div className="flex items-center">
                                        <span className="w-8 font-bold">
                                          <FaMapMarker />
                                        </span>
                                        <p>
                                          {value.building}, {value.city},{" "}
                                          {value.district}, {value.state},{" "}
                                          {value.pin}
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
                                    <p>Rs {val.job.salary}/-</p>
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
                                  {val.skills.length} skills match your profile
                                  - you may be a good fit
                                </p>
                                <div className="mt-3">
                                  <h3 className="font-bold">Requirements </h3>
                                  <p>{val.job.requirements}</p>
                                </div>
                                <div className="mt-3">
                                  <h3 className="font-bold">Description </h3>
                                  <p>{val.job.description}</p>
                                </div>
                              </Modal>
                            </div>
                            <p className="text-sm text-end text-gray-400 mt-2">
                              Applied date: {formatDate(val.appliedDate)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white w-full h-72 sm:h-96 flex flex-col justify-center items-center">
                  <div>
                    <p className="text-black">
                      No applied jobs are available at the moment!
                    </p>
                    <button
                      onClick={() => {
                        setShowAppliedJobs(false);
                      }}
                      className="p-1 sm:p-2 w-24 sm:w-32 mt-4 text-white border xl:ml-20 rounded-full bg-pink-400"
                    >
                      Apply now
                    </button>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <div className=" md:px-10">
              <div className=" flex flex-wrap ml-12 mr-14 justify-between mt-4 mb-4">
                <div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by position or company..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border rounded-lg px-4 py-2 w-64 sm:w-72 md:w-96 focus:outline-none focus:border-pink-300"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowAppliedJobs(true);
                  }}
                  className="bg-pink-500 text-white px-4 py-2 ml-2 mt-2 rounded-lg"
                >
                  See your applied jobs!
                </button>
                <div>
                  <label htmlFor="jobFilter">Filter by Job: </label>
                  <select
                    id="jobFilter"
                    className="border rounded-lg px-4 py-2 w-64 sm:w-25 md:w-50 focus:outline-none focus-border-pink-300"
                    value={filterByJob}
                    onChange={handleFilterByJob}
                  >
                    <option value="">Select Job</option>
                    {jobPosition.map((job, i) => (
                      <option key={i} value={job.position}>
                        {job.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!(filterByJob || searchQuery) && matchedJobs.length > 0 && (
                <h2 className="ml-10 text-lg font-semibold font-mono">
                  Recommended jobs for you!
                </h2>
              )}

              {!(filterByJob || searchQuery) && matchedJobs.length > 0 && (
                <>
                  <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
                    {matchedJobs.map((val, i) => (
                      <li key={i} className="w-full md:w-1/4 ">
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
                              <div className=" mb-10 rounded-full ml-auto mr-2">
                                <button
                                  onClick={() => {
                                    handleSaveJob(val);
                                  }}
                                  className="text-xs text-white border border-transparent bg-pink-400 rounded flex px-2 py-1 flex-raw items-center justify-center"
                                >
                                  <BsBookmark className="fill-current bg-pink-400 text-white mx-1" />
                                  Save
                                </button>
                              </div>
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
                                    {i < 1 && i < val.skills.length - 1
                                      ? ", "
                                      : ""}
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
                                          {value.district}, {value.state},{" "}
                                          {value.pin}
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
                                  {val.skills.length} skills match your profile
                                  - you may be a good fit
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
                            <p className="text-sm text-end text-gray-400 mt-2">
                              Post date : {formatDate(val.date)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {filteredJobs.length > 0 ? (
                <h2 className="ml-10 text-lg font-bold font-mono">
                  Other jobs!
                </h2>
              ) : null}
              <ul className="mt-2 flex flex-wrap overflow-y-auto p-4 ">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((val, i) => (
                    <li key={i} className="w-full md:w-1/4">
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
                            <div className=" mb-10 rounded-full ml-auto mr-2">
                              <button
                                onClick={() => {
                                  handleSaveJob(val);
                                }}
                                className="text-xs text-white border border-transparent bg-pink-400 rounded flex px-2 py-1 flex-raw items-center justify-center"
                              >
                                <BsBookmark className="fill-current bg-pink-400 text-white mx-1" />
                                Save
                              </button>
                            </div>
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
                                  {i < 1 && i < val.skills.length - 1
                                    ? ", "
                                    : ""}
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
                                        {value.district}, {value.state},{" "}
                                        {value.pin}
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
                                {val.skills.length} skills match your profile -
                                you may be a good fit
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
                          <p className="text-sm text-end text-gray-400 mt-2">
                            Post date : {formatDate(val.date)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <span>No jobs available.</span>
                  </div>
                )}
              </ul>

              {!isSearching && paginationCount > 1 && (
                <div>
                  <div className="flex justify-center">
                    <span className="text-gray-500">
                      Page {Math.min(page, paginationCount)} of{" "}
                      {paginationCount}
                    </span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Prev
                    </button>

                    <button
                      className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
                      onClick={() => {
                        setPage(Math.min(page + 1, paginationCount));
                      }}
                      disabled={page >= paginationCount}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default JobView;
