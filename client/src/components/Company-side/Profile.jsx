import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CompanyApi } from "../../configs/api";
import { companyAxiosInstance } from "../../configs/axios/axios";
import {
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaMapMarker,
  FaBook,
} from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const navigate = useNavigate();

  const [companyDetails, setCompanyDetails] = useState({
    company: null,
    startedDate: null,
    email: null,
    about: null,
    headline: null,
    image: null,
    peoples: null,
    jobs: null,
    address: null,
  });

  const rawDate = companyDetails.startedDate;
  console.log(companyDetails, "this is the object");
  let formattedDate = null;
  const dateObj = new Date(rawDate);
  formattedDate = dateObj.toLocaleDateString();

  const data = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  const handleEditProfile = async () => {
    try {
      navigate("/company/company-editProfile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        console.log("entering to the axios profile");
        const response = await companyAxiosInstance
          .get(`${CompanyApi}companyProfile?data=${encodeURIComponent(data)}`)
          .then((res) => {
            let companyData = res.data.companyData;
            setCompanyDetails(companyData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, []);

  return (
    <section className="h-[calc(100vh+35rem)] bg-gray-50">
      <div className="container py-5 h-screen">
        <div className="flex justify-center h-screen">
          <div className="lg:w-9/12 xl:w-7/12 bg-white">
            <div className="bg-white rounded-t pb-2 h-250 text-black flex flex-row">
              <div className="ms-4 mt-5 flex flex-col items-center">
                {companyDetails.image ? (
                  <img
                    src={companyDetails.image}
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
                  <h5>{companyDetails.company}</h5>
                  <p>{companyDetails.headline}</p>
                  <p>{companyDetails.email}</p>

                  <button
                    onClick={handleEditProfile}
                    className="p-1 w-28 h-8 mt-5 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500"
                  >
                    Edit profile
                  </button>
                </div>
              </div>

              <div>
                <div className="flex flex-row mt-28 ml-80 ">
                  <div>
                    <p className="mb-1 text-lg">253</p>
                    <p className="text-xs text-muted mb-0">Posts</p>
                  </div>
                  <div className="ml-5">
                    {companyDetails && companyDetails.jobs ? (
                      <p className="mb-1 text-lg">
                        {companyDetails.jobs.length}
                      </p>
                    ) : (
                      <p className="mb-1 text-lg">No jobs</p>
                    )}
                    <p className="text-xs text-muted mb-0">Jobs</p>
                  </div>
                  <div className="ml-5">
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">Hire Pool</p>
                  </div>
                  <div className="ml-5">
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">People</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 text-black bg-pink-50">
              <div>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                  <div className="md:flex">
                    {companyDetails.about ? (
                      <div className="p-8">
                        <div className="uppercase tracking-wide text-sm flex items-center text-black font-bold">
                          About
                          <span className="ml-2">
                            <FaBook />
                          </span>
                        </div>
                        <p className="mt-2 text-gray-500">
                          {companyDetails.about}
                        </p>
                      </div>
                    ) : (
                      <div hidden></div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-9">
                  <div className="w-96 p-8 bg-white shadow-lg">
                    {companyDetails.address &&
                      companyDetails.address.length > 0 && (
                        <div>
                          <div className="uppercase tracking-wide text-sm text-black font-bold">
                            Contact & Address
                          </div>

                          {companyDetails.address.map((address, index) => (
                            <div>
                              <div className="p-4">
                                <div class="flex items-center mb-2">
                                  <span class="w-8 font-bold">
                                    <FaMapMarker />
                                  </span>
                                  <p>
                                    {address.building}, {address.city},{" "}
                                    {address.district}, {address.state},{" "}
                                    {address.pin}
                                  </p>
                                </div>

                                <div class="flex items-center mb-2">
                                  <span class="w-8 font-bold">
                                    <FaPhone />
                                  </span>
                                  <p>{address.phone}</p>
                                </div>
                                <div class="flex items-center">
                                  <span class="w-8 font-bold">
                                    <FaEnvelope />
                                  </span>
                                  <p>{companyDetails.email}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="w-96 p-8 ml-10 bg-white shadow-lg">
                    <div className="uppercase tracking-wide text-sm text-black font-bold">
                      Other details
                    </div>
                    <div className="p-4">
                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaCalendar />
                        </span>
                        <p>{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 mb-4">
              <div>
                <button
                  className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                    activeTab === "posts" ? "bg-pink-400" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts
                </button>
                <button
                  className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                    activeTab === "jobs" ? "bg-pink-400" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("jobs")}
                >
                  Jobs
                </button>
                <button
                  className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                    activeTab === "hirePool" ? "bg-pink-400" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("hirePool")}
                >
                  Hire pool
                </button>
                <button
                  className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                    activeTab === "people" ? "bg-pink-400" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("people")}
                >
                  People
                </button>
              </div>
              <p className="mb-0">
                <a
                  href="#!"
                  className="p-1 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500"
                >
                  Show all
                </a>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white">
              <div className="mb-2 p-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                  alt="image 1"
                  className="w-full rounded-3"
                />
              </div>
              <div className="mb-2 p-4">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                  alt="image 2"
                  className="w-full rounded-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
