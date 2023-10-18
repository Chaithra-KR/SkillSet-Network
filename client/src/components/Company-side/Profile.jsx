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
  const [applicantData, setApplicantData] = useState([]);
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

  const navigate = useNavigate();

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
        const response = await companyAxiosInstance
          .get(`${CompanyApi}companyProfile?data=${encodeURIComponent(data)}`)
            let companyData = response.data.companyData;
            let applicantData = response.data.applicantData;
            setCompanyDetails(companyData);
            setApplicantData(applicantData);
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();  
  }, []);


  return (
    <>
      <section className="flex justify-center items-center">
        <div className="bg-gray-50 w-full">
          <div className="container py-5 mx-auto lg:flex lg:justify-center lg:items-center">
            <div className="lg:w-9/12 xl:w-7/12 bg-white p-4 lg:p-8">
              <div className="bg-white rounded-t pb-2 text-black flex flex-col lg:flex-row">
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
                      className="p-1 w-28 h-8 mt-5 border border-pink-400 rounded bg-pink-100 shadow-md hover:text-white hover:bg-pink-500"
                    >
                      Edit profile
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-row mt-28 ml-80 ">
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
                      {applicantData ? (
                        <p className="mb-1 text-lg">{applicantData.length}</p>
                      ) : (
                        <p className="mb-1 text-lg">No requests</p>
                      )}
                      <p className="text-xs text-muted mb-0">Hire Pool</p>
                    </div>
                    <div className="ml-5">
                      <p className="mb-1 text-lg">1026</p>
                      <p className="text-xs text-muted mb-0">People</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="p-4 lg:p-8 text-black bg-pink-50 mt-6">
                  {companyDetails.about ? (
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6">
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
                    </div>
                  ) : null}

                  <div className="flex flex-col lg:flex-row justify-between mt-6">
                    <div className="w-full lg:w-1/2">
                      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-6">
                        {companyDetails.address &&
                          companyDetails.address.length > 0 && (
                            <div className="p-8">
                              <div className="uppercase tracking-wide text-sm mb-2 text-black font-bold">
                                Contact & Address
                              </div>
                              {companyDetails.address.map((address, index) => (
                                <div key={index}>
                                  <div className="flex items-center mb-2">
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
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 ml-2 mt-6 lg:mt-0">
                      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                        <div className="mt-1 p-8">
                          <div className="uppercase tracking-wide text-sm mb-2 text-black font-bold">
                            Contact & Address
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <span class="w-8 font-bold">
                                <FaCalendar />
                              </span>
                              <p>{formattedDate}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1">
                          {companyDetails.cv ? (
                            <div className="px-8">
                              <div className="uppercase tracking-wide text-sm text-black font-bold">
                                Resume / CV
                              </div>
                              <div className="p-4">
                                <button
                                  onClick={() =>
                                    window.open(companyDetails.cv, "_blank")
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
