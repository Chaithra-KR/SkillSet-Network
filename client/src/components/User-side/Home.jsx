import React, { useState, useEffect } from "react";
import { UserApi } from "../../configs/api";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    email: null,
    headline: null,
    image: null,
  });
  const [matchedJobs, setMatchedJobs] = useState([]);

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

  const handleShowNewPost = () => {
    navigate("/posts");
  };
  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        const res = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(seeker)}`
        );
        const data = res.data.seekerData;
        setUserDetails(data);
        const jobData = res.data.matchedJobs;
        setMatchedJobs(jobData);
      } catch (error) {
        console.error(error);
      }
    };
    handleJobDetails();
  }, [seeker]);

  return (
    <>
      <div className="w-full h-screen bg-white">
        <div className="flex flex-col md:flex-row lg:flex-row">
          <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
            <div className="bg-pink-100 w-72 m-5 h-6/6 rounded p-6 flex flex-col items-center">
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
                <div className="pt-8">
                  <button className="bg-pink-600 rounded px-5 py-1 text-white">
                    Premium
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={handleShowNewPost}
              className="w-full md:w-[600px] xl:w-[800px] bg-pink-100 border border-pink-200 hover:bg-pink-500 shadow-md h-14 mb-2 rounded"
            >
              New Post
            </button>

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
                        <div>
                          <h3 className="font-bold">Position</h3>
                          <p className="text-sm">{val.position}</p>
                        </div>
                        <div>
                          <h3 className="font-bold">Skills</h3>
                          <p className="text-sm">
                            {val.skills.map((skill, i) => (
                              <span key={i}>
                                {skill}
                                {i !== val.skills.length - 1 && ", "}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                      <h3 className="title text-lg font-semibold">
                        {val.salary}
                      </h3>
                      <button className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none">
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
