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

  const handleSearch = () => {
    const regex = new RegExp(searchQuery, "i");
    const filtered = searchQuery
      ? jobs.filter(
          (job) => regex.test(job.position) || regex.test(job.company.company)
        )
      : jobs;

    setFilteredJobs(filtered);
  };

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

  const handleFilterByJob = () => {
    const filteredByJob = filterByJob
      ? jobs.filter((job) => job.position === filterByJob)
      : jobs;

    setFilteredJobs(filteredByJob);
  };

  return (
    <>
      {isLoading ? (
        <UserLoading />
      ) : (
        <div className="w-full bg-white">
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
                  <ul className="flex flex-wrap overflow-y-auto p-4">
                    {appliedJobs.map((val) => (
                      <li className="w-full md:w-1/5" key={val._id}>
                        <div className="box mb-4 p-4 text-center shadow-md">
                          <div className="flex row-auto">
                            <div className="relative mr-4">
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
                            <h3 className="title text-lg pt-5 font-semibold">
                              <p>{val.company.company}</p>
                              <p>Salary : Rs {val.job.salary}/-</p>
                            </h3>
                          </div>

                          <div className="bg-pink-50 h-32 mb-1 flex justify-center px-5">
                            <div className="py-2">
                              <div>
                                <p className="text-lg font-bold">
                                  {val.job.position}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm">
                                  at{" "}
                                  <span className="font-bold">
                                    {" "}
                                    {val.company.company}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="font-bold">Required skills :</p>
                                <p className="italic mb-1">
                                  {val.skills.map((skill, i) => (
                                    <>
                                      {skill}
                                      {val.skills.length - 1 === i ? "" : ", "}
                                    </>
                                  ))}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-end text-gray-400">
                            Applied date: {formatDate(val.appliedDate)}
                          </p>
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
            <>
              <div className=" flex flex-wrap ml-12 mr-14 justify-between mt-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search by position or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-64 sm:w-72 md:w-96 focus:outline-none focus:border-pink-300"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
                  >
                    Search
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowAppliedJobs(true);
                  }}
                  className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
                >
                  See your applied jobs!
                </button>
                <div>
                  <label htmlFor="jobFilter">Filter by Job: </label>
                  <select
                    id="jobFilter"
                    className="border rounded-lg px-4 py-2 w-64 sm:w-25 md:w-50 focus:outline-none focus:border-pink-300"
                    value={filterByJob}
                    onChange={(e) => setFilterByJob(e.target.value)}
                  >
                    <option value="">Select Job</option>
                    {jobPosition.map((job) => (
                      <option key={job._id} value={job.position}>
                        {job.position}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleFilterByJob}
                    className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {!(filterByJob || searchQuery) && matchedJobs.length > 0 && (
                <h2 className="ml-10 text-lg font-semibold font-mono">
                  Recommended jobs for you!
                </h2>
              )}

              {!(filterByJob || searchQuery) && matchedJobs.length > 0 && (
                <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
                  {matchedJobs.map((val, i) => (
                    <li className="w-full md:w-1/4" key={i}>
                      <div className="box mb-4 p-4 text-center shadow-md">
                        <div className="bg-pink-50 h-32 mb-2">
                          <div>
                            <p className="text-lg font-bold">{val.position}</p>
                          </div>
                          <div>
                            <p className="text-sm">
                              at{" "}
                              <span className="font-bold">
                                {" "}
                                {val.company.company}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="font-bold">Required skills :</p>
                            <p className="italic mb-1">
                              {val.skills.map((skill, i) => (
                                <>
                                  {skill}
                                  {val.skills.length - 1 === i ? "" : ", "}
                                </>
                              ))}
                            </p>
                          </div>
                        </div>

                        <h3 className="title text-lg font-semibold">
                          Rs {val.salary}/-
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
                              <>
                                {skill}
                                {val.skills.length - 1 === i ? "" : ", "}
                              </>
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
                          <button
                            onClick={() => {
                              handleSaveJob(val);
                            }}
                            className="p-1 mt-2 w-16 border border-transparent  text-white rounded-full bg-pink-500 shadow-md hover:bg-pink-400"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              handleApplyJob(val._id);
                            }}
                            className="p-1 mt-2 w-16 border border-transparent  text-white rounded-full bg-pink-700 shadow-md ml-2 hover:bg-pink-400"
                          >
                            Apply
                          </button>
                        </Modal>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {filteredJobs.length > 0 ? (
                <h2 className="ml-10 text-lg font-bold font-mono">
                  Other jobs!
                </h2>
              ) : (
                <div hidden> </div>
              )}

              <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, i) => (
                    <li className="w-full md:w-1/4" key={i}>
                      <div className="box mb-4 p-4 text-center shadow-md">
                        <div className="bg-pink-50 h-32 mb-2">
                          <div>
                            <p className="text-lg font-bold">{job.position}</p>
                          </div>
                          <div>
                            <p className="text-sm">
                              at{" "}
                              <span className="font-bold">
                                {" "}
                                {job.company.company}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="font-bold">Required skills :</p>
                            <p className="italic mb-1">
                              {job.skills.map((skill, i) => (
                                <>
                                  {skill}
                                  {job.skills.length - 1 === i ? "" : ", "}
                                </>
                              ))}
                            </p>
                          </div>
                        </div>
                        <h3 className="title text-lg font-semibold">
                          Rs {job.salary}/-
                        </h3>
                        <Button
                          className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                          type="pink"
                          onClick={() => openModal(job)}
                        >
                          View
                        </Button>
                        <Modal
                          title="About the vacancy"
                          visible={selectedJob === job}
                          onCancel={closeModal}
                          footer={null}
                        >
                          <h1 className="text-xl font-bold pb-3">
                            {job.position}{" "}
                            <span className="text-sm">
                              ( {job.company.company} )
                            </span>
                          </h1>
                          <div className="mb-3">
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaClock />
                              </span>
                              <p>{job.time}</p>
                            </div>
                            {job.company.address.map((val) => (
                              <div key={val.pin}>
                                <div className="flex items-center">
                                  <span className="w-8 font-bold">
                                    <FaMapMarker />
                                  </span>
                                  <p>
                                    {val.building}, {val.city}, {val.district},{" "}
                                    {val.state}, {val.pin}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-8 font-bold">
                                    <FaPhone />
                                  </span>
                                  <p>{val.phone}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaEnvelope />
                              </span>
                              <p>{job.company.email}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="w-8 font-bold">
                                <FaMoneyBillAlt />
                              </span>
                              <p>Rs {job.salary}/-</p>
                            </div>
                          </div>
                          <p>
                            <span className="font-bold">
                              Required skills :{" "}
                            </span>
                            {job.skills.map((skill, i) => (
                              <>
                                {skill}
                                {job.skills.length - 1 === i ? "" : ", "}
                              </>
                            ))}
                          </p>
                          {/* <p className='text-green-500'>5 of 5 skills match your profile - you may be a good fit</p> */}
                          <div className="mt-3">
                            <h3 className="font-bold">Requirements </h3>
                            <p>{job.requirements}</p>
                          </div>
                          <div className="mt-3">
                            <h3 className="font-bold">Description </h3>
                            <p>{job.description}</p>
                          </div>
                          <button className="p-1 mt-2 w-16 border border-transparent  text-white rounded-full bg-pink-500 shadow-md hover:bg-pink-400">
                            Apply
                          </button>
                        </Modal>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <span>No jobs available.</span>
                  </div>
                )}
              </ul>

              {filteredJobs.length > 0 ? (
                <div>
                  <div className="flex justify-center">
                    <span className="text-gray-500 ">
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
              ) : null}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default JobView;
