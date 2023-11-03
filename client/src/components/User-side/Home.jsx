import React, { useState, useEffect } from "react";
import { UserApi } from "../../configs/api";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMoneyBillAlt,
  FaClock,
  FaMapMarker,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import UserLoading from "../Loading/UserLoadings/UserLoading";
import { Button, Modal } from "antd";
import { BsBookmark } from "react-icons/bs";
import { TbTargetArrow, TbTargetOff } from "react-icons/tb";

const Home = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    email: null,
    headline: null,
    image: null,
  });
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showRequestSection, setShowRequestSection] = useState(false);
  const [companyStatus, setCompanyStatus] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();
  const seeker = useSelector((state) => state?.seekerDetails.seekerToken);

  const handleEditProfileView = () => {
    navigate("/edit-myProfile");
  };

  const handleChatWithCompany = () => {
    navigate("/chat-with-company");
  };

  const handleSavedJobsView = () => {
    navigate("/saved-jobs");
  };

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleShowNewPost = () => {
    if (userDetails.premiumStatus === true) {
      navigate("/posts");
    } else {
      navigate("/upgrade-premium");
    }
  };
  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        const res = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(seeker)}`
        );
        setUserDetails(res.data.seekerData);
        setMatchedJobs(res.data.matchedJobs);
        setCompanies(res.data.companies);
        const userRequestsStatus = {};
        res.data.seekerData.userRequests.forEach((request) => {
          userRequestsStatus[request.companyId] = request.status;
        });
        setCompanyStatus(userRequestsStatus);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    handleJobDetails();
  }, [seeker, refresh]);

  const handleRequestAsEmploy = async (company) => {
    try {
      const data = {
        token: seeker,
        companyId: company,
      };
      const res = await Axios.post(`${UserApi}requestAsEmploy`, { data: data });
      if (res.data.success) {
        toast.success(res.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
        if (refresh === true) {
          setRefresh(false);
        } else {
          setRefresh(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isLoading ? (
        <UserLoading />
      ) : (
        <div className="w-full h-screen bg-white">
          <div className="flex flex-col md:flex-row lg:flex-row">
            <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
              <div className="bg-gray-100 w-72 m-5 h-6/6 rounded p-6 flex flex-col items-center">
                <div className="mt-8">
                  {userDetails.image ? (
                    <img
                      src={userDetails.image}
                      alt="User Profile"
                      className="w-28 h-28 rounded-full"
                    />
                  ) : (
                    <img
                      src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                      alt="Generic placeholder image"
                      className="w-28 h-28 rounded-full"
                    />
                  )}
                </div>
                <div className="mt-6 text-center">
                  <h1 className="text-xl font-semibold">
                    {userDetails.username}
                  </h1>
                  <h2 className="text-sm text-gray-600">
                    {userDetails.headline}
                  </h2>
                </div>
                <div className="mt-4 flex flex-col items-center space-y-2">
                  <button
                    onClick={handleSavedJobsView}
                    className="bg-pink-600 rounded px-4 py-1 text-white"
                  >
                    Saved jobs
                  </button>
                  <button
                    onClick={handleEditProfileView}
                    className="bg-pink-600 rounded px-4 py-1 text-white"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleChatWithCompany}
                    className="bg-pink-600 rounded px-9 py-1 text-white"
                  >
                    Chat
                  </button>
                  {userDetails.premiumStatus === true ? null : (
                    <div className="pt-8">
                      <button
                        onClick={() => {
                          navigate("/upgrade-premium");
                        }}
                        className="bg-pink-600 rounded px-5 py-1 text-white"
                      >
                        Premium
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex flex-wrap justify-between mt-3">
                <button
                  onClick={handleShowNewPost}
                  className="w-full md:w-1/2 lg:w-1/3 xl:w-[390px] bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none  h-14 mb-2"
                >
                  New Post
                </button>
                <button
                  onClick={() => {
                    setShowRequestSection(true);
                  }}
                  className="w-full md:w-1/2 lg:w-1/3 xl:w-[390px] bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none  h-14 mb-2"
                >
                  Request as employee
                </button>
              </div>
              {showRequestSection ? (
                <div className="bg-gray-100 w-full md:w-[600px] xl:w-[800px] rounded p-5 h-[500px] overflow-y-auto">
                  <h2 className="text-lg font-semibold">Companies!</h2>
                  <section>
                    {companies && companies.length > 0 ? (
                      <div>
                        {companies.map((val) => (
                          <div className="container pb-2" key={val._id}>
                            <div className="md:mx-auto">
                              <ul className="space-y-4">
                                <li className="flex flex-wrap items-center justify-between p-2 bg-white border rounded-lg shadow-md">
                                  <div className="flex-grow flex">
                                    <div className="relative ">
                                      {val.image ? (
                                        <img
                                          className="rounded-full w-20 h-20 border-persian-orange p-2"
                                          src={val.image}
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
                                    <div>
                                      <h4 className="text-xl px-7 font-semibold">
                                        {val.company}
                                      </h4>
                                      {val.address &&
                                        val.address.length > 0 && (
                                          <div className="p-5">
                                            <div className="uppercase tracking-wide text-sm mb-2 text-black font-bold">
                                              Contact & Address
                                            </div>
                                            {val.address.map(
                                              (address, index) => (
                                                <div key={index}>
                                                  <div className="flex items-center mb-2">
                                                    <span className="w-8 font-bold">
                                                      <FaMapMarker />
                                                    </span>
                                                    <p>
                                                      {address.building},{" "}
                                                      {address.city},{" "}
                                                      {address.district},{" "}
                                                      {address.state},{" "}
                                                      {address.pin}
                                                    </p>
                                                  </div>

                                                  <div className="flex items-center mb-2">
                                                    <span className="w-8 font-bold">
                                                      <FaPhone />
                                                    </span>
                                                    <p>{address.phone}</p>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <span className="w-8 font-bold">
                                                      <FaEnvelope />
                                                    </span>
                                                    <p>{val.email}</p>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div>
                                    {companyStatus[val._id] === "pending" ? (
                                      <button className="bg-pink-600 text-white px-3 py-1 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none">
                                        Requested
                                      </button>
                                    ) : companyStatus[val._id] ===
                                      "accepted" ? (
                                      <button className="bg-pink-600 text-white px-3 py-1 mt-2 rounded-md hover-bg-green-700 transition-colors duration-300 focus:outline-none">
                                        Employ
                                      </button>
                                    ) : companyStatus[val._id] ===
                                      "rejected" ? (
                                      <button className="bg-red-500 text-white px-3 py-1 mt-2 rounded-md hover-bg-red-700 transition-colors duration-300 focus:outline-none">
                                        Rejected
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          handleRequestAsEmploy(val._id);
                                        }}
                                        className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none"
                                      >
                                        Request
                                      </button>
                                    )}
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white w-full h-72 sm:h-96 flex flex-col justify-center items-center">
                        <div>
                          <p className="text-black">
                            No companies are available at the moment!
                          </p>
                          <button
                            className="p-1 sm:p-2 w-24 sm:w-32 mt-4 text-white border xl:ml-20 rounded-full bg-pink-400"
                            onClick={() => {
                              navigate("/jobView");
                            }}
                          >
                            Apply now
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div className="bg-gray-100 w-full md:w-[600px] xl:w-[800px] rounded p-5 h-[500px] overflow-y-auto">
                  <h2 className="text-lg font-semibold">
                    Recommended jobs for you!
                  </h2>
                  {matchedJobs.length === 0 ? (
                    <div className="flex justify-center mt-20 pb-24">
                      <div className="section text-center">
                        <h1 className="error text-xl font-bold text-pink-600">
                          Oops! No Jobs found
                        </h1>
                        <div className="page text-lg font-semibold text-gray-700 mt-4">
                          Add new skills to get job.
                        </div>
                        <button
                          onClick={handleEditProfileView}
                          className="bg-pink-600 rounded px-3 mt-3 py-1 text-white"
                        >
                          Add Skills
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                      {matchedJobs.map((val, i) => (
                        <li
                          className="bg-white p-4 text-center shadow-md rounded"
                          key={i}
                        >
                          <div className="bg-pink-50 h-32 mb-2">
                            <p className=" flex items-center  text-pink-600  text-sm hover:text-pink-700  rounded-lg py-1 px-3 transition duration-300 ease-in-out">
                              <TbTargetArrow className=" mx-1" />
                              Recruiting
                            </p>
                            <div className="job-card-title font-semibold text-lg">
                              {val.position}
                            </div>

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
                          </div>
                          <h3 className="title text-lg font-semibold">
                            Rs {val.salary}/-
                          </h3>
                          <Button
                            className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
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
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
