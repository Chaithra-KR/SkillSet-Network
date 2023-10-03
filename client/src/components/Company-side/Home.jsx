import React, { useState, useEffect } from "react";
import { CompanyApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { companyAxiosInstance } from "../../configs/axios/axios";
import axios from "axios";

const Home = () => {
  const [companyDetails, setCompanyDetails] = useState({
    company: null,
    email: null,
    headline: null,
    image: null,
    peoples: null,
  });

  const [matchedUsers, setMatchedUsers] = useState([]);

  const company = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        await axios
          .get(
            `${CompanyApi}companyProfile?data=${encodeURIComponent(company)}`
          )
          .then((res) => {
            let data = res.data.companyData;
            let userData = res.data.matchedUsers;
            setCompanyDetails(data);
            setMatchedUsers(userData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleJobDetails();
  }, []);

  const navigate = useNavigate();

  const handleJobView = () => {
    navigate("/company/company-Jobs");
  };

  const handleProfileAccess = () => {
    navigate("/company/company-profile");
  };

  const handleEditProfileAccess = () => {
    navigate("/company/company-editProfile");
  };

  const handleUserProfileView = (userId) =>{
    navigate(`/company/view-userProfile?userId=${userId}`)
  }
  return (
    <>
      <div className="w-full h-screen bg-white">
        <div className="flex flex-col md:flex-row lg:flex-row">
          <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
            <div className="bg-pink-100 w-72 m-5 h-6/6 rounded p-6 flex flex-col items-center">
              <div className="mt-8">
                {companyDetails.image ? (
                  <img
                    src={companyDetails.image}
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
                  {companyDetails.username}
                </h1>
                <h2 className="text-sm text-gray-600">
                  {companyDetails.headline}
                </h2>
              </div>
              <div className="mt-4 flex flex-col items-center space-y-2">
                <button
                  onClick={handleProfileAccess}
                  className="bg-pink-600 rounded px-3 py-1 text-white"
                >
                  View Profile
                </button>
                <button
                  onClick={handleEditProfileAccess}
                  className="bg-pink-600 rounded px-4 py-1 text-white"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleEditProfileAccess}
                  className="bg-pink-600 rounded px-9 py-1 text-white"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap justify-between mt-3">
              <button className="w-full md:w-1/2 lg:w-1/3 xl:w-[390px] bg-pink-100 border border-pink-200 hover:bg-pink-500 shadow-md h-14 mb-2 rounded">
                New Post
              </button>
              <button
                onClick={handleJobView}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-[390px] bg-pink-100 border border-pink-200 hover:bg-pink-500 shadow-md h-14 mb-2 rounded"
              >
                New Job
              </button>
            </div>

            <div className="bg-gray-100 w-full md:w-[600px] xl:w-[800px] rounded p-5 h-[500px] overflow-y-auto">
              <h2 className="text-lg font-semibold">
                Recommended candidates for you!
              </h2>
              <ul className="mt-2 flex flex-wrap">
                {matchedUsers.map((val, i) => (
                  <li
                    className="w-56 p-4 bg-white rounded-lg shadow-md mr-4 mb-4"
                    key={i}
                  >
                    <div className="text-center">
                      {val.image ? (
                        <img
                          className="rounded-full w-24 h-24 mx-auto border-2 border-persian-orange p-2"
                          src={val.image}
                          alt="user"
                        />
                      ) : (
                        <img
                          className="rounded-full w-24 h-24 mx-auto border-2 border-persian-orange p-2"
                          src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                          alt="user"
                        />
                      )}

                      <h3 className="text-xl font-semibold mt-4">
                        {val.username}
                      </h3>
                      <div className="mt-2">
                        <p>{val.headline}</p>
                      </div>
                      <div>
                        <h3 className="font-bold">Skills</h3>
                        <p className="text-sm">
                          {val.skills.map((skill, i) => (
                            <>
                              {skill}
                              {val.skills.length - 1 === i ? "" : ", "}
                            </>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                    <button className="bg-color3 text-black hover:text-white border rounded px-4 py-2 hover:bg-pink-500">
                      Message
                    </button>
                    <button onClick={()=>{handleUserProfileView(val._id)}} className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2 ml-2">
                      Profile
                    </button>
                  </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
