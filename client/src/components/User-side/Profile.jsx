import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserApi } from "../../configs/api";
import Axios from "axios";
import { seekerDetails } from "../../Store/storeSlices/seekerAuth";
import {
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaMapMarker,
  FaBook,
} from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(true);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: null,
    headline: null,
    about: null,
    skills: null,
    location: null,
    image: null,
    cv: null,
    email: null,
    dob: null,
    phone: null,
    experience: null,
    posts: null,
  });

  const [appliedJobs, setAppliedJobs] = useState([]);
  const rawDate = userDetails.dob;
  console.log(userDetails, "this is the object");
  let formattedDate = null;
  const dateObj = new Date(rawDate);
  formattedDate = dateObj.toLocaleDateString();

  const data = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const handleEditProfile = async () => {
    try {
      navigate("/edit-myProfile", { state: { userDetails } });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        console.log("entering to the axios profile");
        const response = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(data)}`
        ).then((res) => {
          let seekerData = res.data.seekerData;
          let appliedJobs = res.data.appliedJobs;

          setUserDetails(seekerData);
          setAppliedJobs(appliedJobs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, []);

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

  return (
    <>
      <section className="flex justify-center items-center">
        <div className="bg-gray-50 w-full">
          <div className="container py-5 mx-auto lg:flex lg:justify-center lg:items-center">
            <div className="lg:w-9/12 xl:w-7/12 bg-white p-4 lg:p-8">
              <div className="bg-white rounded-t pb-2 text-black flex flex-col lg:flex-row">
                <div className="ms-4 mt-5 flex flex-col items-center">
                  {userDetails.image ? (
                    <img
                      src={userDetails.image}
                      alt="User Profile"
                      className="img-fluid img-thumbnail mt-9  w-28 h-28 rounded-full"
                    />
                  ) : (
                    <img
                      src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                      alt="Generic placeholder image"
                      className="img-fluid img-thumbnail mt-4 mb-16 w-32 h-32 rounded-full"
                    />
                  )}
                </div>
                <div>
                  <div className="ms-3 flex flex-col mt-14">
                    <h5>{userDetails.username}</h5>
                    <p>{userDetails.headline}</p>
                    <p>{userDetails.email}</p>
                    <button
                      onClick={handleEditProfile}
                      className="p-1 w-28 h-8 mt-5 border border-pink-400 rounded bg-pink-100 hover:text-white shadow-md hover:bg-pink-500"
                    >
                      Edit profile
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-row mt-28 pl-96 ">
                    {userDetails.skills && userDetails.skills.length > 0 && (
                      <div>
                        <p className="mb-1 pl-2 text-lg">
                          {userDetails.skills.length}{" "}
                        </p>
                        <p className="text-xs text-muted mb-0">Skills</p>
                      </div>
                    )}

                    <div className="pl-2">
                      <p className="mb-1 text-lg pl-6">{appliedJobs.length}</p>
                      <p className="text-xs text-muted mb-0">Applied jobs</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="p-4 lg:p-8 text-black bg-pink-50 mt-6">
                  {userDetails.about ? (
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6">
                      <div className="p-8">
                        <div className="uppercase tracking-wide text-sm flex items-center text-black font-bold">
                          About
                          <span className="ml-2">
                            <FaBook />
                          </span>
                        </div>
                        <p className="mt-2 text-gray-500">
                          {userDetails.about}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col lg:flex-row justify-between mt-6">
                    <div className="w-full lg:w-1/2">
                      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6">
                        {userDetails.location &&
                          userDetails.location.length > 0 && (
                            <div className="p-8">
                              <div className="uppercase tracking-wide text-sm mb-2 text-black font-bold">
                                Personal details
                              </div>
                              {userDetails.location.map((location, index) => (
                                <div key={index}>
                                  <div className="flex items-center mb-2">
                                    <span className="w-8 font-bold">
                                      <FaMapMarker />
                                    </span>
                                    <p>
                                      {location.city}, {location.state},{" "}
                                      {location.district}
                                    </p>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <span className="w-8 font-bold">
                                      <FaCalendar title="DOB" />
                                    </span>
                                    <p>{formattedDate}</p>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <span className="w-8 font-bold">
                                      <FaEnvelope />
                                    </span>
                                    <p>{userDetails.email}</p>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <span className="w-8 font-bold">
                                      <FaPhone />
                                    </span>
                                    <p>{userDetails.phone}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        {userDetails.skills &&
                          userDetails.skills.length > 0 && (
                            <div className="px-8">
                              <div className="uppercase tracking-wide text-sm text-black font-bold">
                                Skills
                              </div>
                              <div className="p-3">
                                <p>
                                  {userDetails.skills.map((skill, i) => (
                                    <>
                                      {skill}
                                      {userDetails.skills.length - 1 === i
                                        ? ""
                                        : ", "}
                                    </>
                                  ))}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 ml-2 mt-6 lg:mt-0">
                      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                        <div className="mt-1">
                          {userDetails.experience ? (
                            <div className="p-8">
                              <div className="uppercase tracking-wide text-sm text-black font-bold">
                                Experience
                              </div>
                              <div className="p-4">
                                <p>{userDetails.experience}</p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="mt-1">
                          {userDetails.cv ? (
                            <div className="px-8">
                              <div className="uppercase tracking-wide text-sm text-black font-bold">
                                Resume / CV
                              </div>
                              <div className="p-4">
                                <button
                                  onClick={() =>
                                    window.open(userDetails.cv, "_blank")
                                  }
                                  className="px-4 py-2 mt-3 border border-pink-300 w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300"
                                >
                                  View CV
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 lg:mt-8 mb-4">
                <div className="flex flex-wrap">
                  <div>
                    <button
                      className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                        activeTab === true
                          ? "bg-pink-400 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setActiveTab(true)}
                    >
                      Posts
                    </button>
                    <button
                      className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                        activeTab === false
                          ? "bg-pink-400 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setActiveTab(false)}
                    >
                      Jobs
                    </button>
                  </div>
                </div>
              </div>
              {activeTab === true ? (
                <div>
                  {userDetails.posts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                      {userDetails.posts.map((post, index) => (
                        <div key={post._id} className="mb-2 ml-7 p-3">
                          <img
                            src={post.picture}
                            alt={`image ${index + 1}`}
                            className="h-48 rounded-3 flex justify-center items-center"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white w-full h-72 sm:h-96 flex flex-col justify-center items-center">
                      <div>
                        <p className="text-black">No posts available</p>
                        <button
                          className="p-1 sm:p-2 w-24 sm:w-32 mt-4 border text-white rounded-full bg-pink-400"
                          onClick={() => {
                            navigate("/home");
                          }}
                        >
                          Post now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <section>
                {appliedJobs && appliedJobs.length > 0 ? (
                  <div>
                    {appliedJobs.map((val) => (
                      <div className="container pb-2" key={val._id}>
                        <div className="md:mx-auto">
                          <ul className="space-y-4">
                            <li className="flex flex-wrap items-center justify-between p-4 bg-white border rounded-lg shadow-md">
                              <div className="flex-grow flex items-center">
                                <div className="relative mr-4">
                                  {val.company.image ? (
                                    <img
                                      className="rounded-full w-20 h-20 border-persian-orange p-2"
                                      src={val.company.image}
                                      alt="user"
                                    />
                                  ) : (
                                    <img
                                      className="rounded-full w-24 h-24 border-2 border-persian-orange p-2"
                                      src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                                      alt="user"
                                    />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold">
                                    {val.company.company}
                                  </h4>
                                  <h5 className="text-black">
                                    Position: {val.job.position}
                                  </h5>
                                  <p className="text-gray-500">
                                    Skills:{" "}
                                    {val.job.skills.map((skill, i) => (
                                      <>
                                        {skill}
                                        {val.job.skills.length - 1 === i ? "" : " , "}
                                      </>
                                    ))}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm pl-1 pb-1 text-gray-400">
                                  Applied date: {formatDate(val.appliedDate)}
                                </p>
                                <p className="px-4 py-2 text-black bg-gray-100 rounded-md">
                                  Salary: Rs.{val.job.salary}/-
                                </p>
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
                    <p className="text-black">No applied jobs are available at the moment!</p>
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
