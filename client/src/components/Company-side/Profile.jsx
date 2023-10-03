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
import { Button, Modal } from "antd";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(true);
  const [applicantData, setApplicantData] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  const openModal = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

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
        console.log("entering to the axios profile");
        const response = await companyAxiosInstance
          .get(`${CompanyApi}companyProfile?data=${encodeURIComponent(data)}`)
          .then((res) => {
            let companyData = res.data.companyData;
            let applicantData = res.data.applicantData;
            setCompanyDetails(companyData);
            setApplicantData(applicantData);
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
                        <p className="mb-1 text-lg">
                          {applicantData.length}
                        </p>
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
                      Jobs
                    </button>
                    <button
                      className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                        activeTab === false
                          ? "bg-pink-400 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setActiveTab(false)}
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
                </div>
              </div>
              {activeTab === true ? (
                <section>
                  {companyDetails.jobs
                    ? companyDetails.jobs.map((val) => (
                        <div className="container pb-2">
                          <div className="md:mx-auto">
                            <ul className="space-y-4">
                              <li className="flex flex-wrap items-center justify-between p-4 bg-white border rounded-lg shadow-md">
                                <div className="flex-grow flex items-center">
                                  <div>
                                    <h5 className="text-black">
                                      Position : {val.position}
                                    </h5>
                                    <p className="text-gray-500">
                                      Skills :{" "}
                                      {val.skills.map((skill, i) => (
                                        <>
                                          {skill}
                                          {val.skills.length - 1 === i
                                            ? ""
                                            : " , "}
                                        </>
                                      ))}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm pl-1 pb-1 text-gray-400">
                                    Shared date : {formatDate(val.date)}
                                  </p>
                                  <p className="px-4 py-2 text-black bg-gray-100 rounded-md">
                                    Salary: Rs.{val.salary}/-
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    : null}
                </section>
              ) : (
                <section>
                  {applicantData.length > 0
                    ? applicantData.map((val) => (
                        <div className="p-4 bg-white rounded-lg shadow-md mb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              {val.user.image ? (
                                <img
                                  className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                  src={val.user.image}
                                  alXt="user"
                                />
                              ) : (
                                <img
                                  className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                  src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                                  alt="user"
                                />
                              )}
                              <div>
                                <p>
                                  <scan className="font-semibold">
                                    {val.user.username}{" "}
                                  </scan>{" "}
                                  applied for{" "}
                                  {val.job && val.job.position ? (
                                    <scan className="font-semibold">
                                      {val.job.position}
                                    </scan>
                                  ) : null}
                                </p>
                                <p className="text-sm">{val.coverLetter}</p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button
                                className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                                type="pink"
                                onClick={() => openModal(val)}
                              >
                                View
                              </Button>
                              <Modal
                                title="Application letter"
                                visible={selectedNotification === val}
                                onCancel={closeModal}
                                footer={null}
                              >
                                <p className="mb-2">
                                  <span className="font-bold mr-1">
                                    Subject :
                                  </span>{" "}
                                  Application for
                                  {val.job && val.job.position ? (
                                    <span className="ml-1 font-bold">
                                      {val.job.position}{" "}
                                    </span>
                                  ) : null}
                                  at you company
                                </p>

                                <p>Dear sir,</p>

                                <p className="mb-1">
                                  I am writing to apply for the{" "}
                                  {val.job && val.job.position ? (
                                    <span className="font-bold mr-1">
                                      {val.job.position}{" "}
                                    </span>
                                  ) : null}
                                  position at your company. Attached is my CV
                                  outlining my relevant skills
                                  {val.experience ? (
                                    <scan className="ml-1">
                                      and{" "}
                                      <span className="font-bold">
                                        {val.experience}.
                                      </span>
                                    </scan>
                                  ) : (
                                    <scan>.</scan>
                                  )}{" "}
                                </p>

                                <p className="mb-1">
                                  I have a strong track record in{" "}
                                  <span className="font-bold mr-1">
                                    {val.skills.map((skill, i) => (
                                      <>
                                        {skill}
                                        {val.skills.length - 2 === i
                                          ? " and "
                                          : val.skills.length - 1 === i
                                          ? ""
                                          : ", "}
                                      </>
                                    ))}
                                  </span>
                                  . I am eager to bring these skills to your
                                  company and contribute to your team's success.
                                </p>

                                <p className="mb-1">
                                  I am available for an interview at{" "}
                                  <span className="font-bold mr-1">
                                    {val.phone}
                                  </span>{" "}
                                  or via email at{" "}
                                  <span className="font-bold mr-1">
                                    {val.email}
                                  </span>
                                  .
                                </p>
                                <p className="mb-2">
                                  Thank you for considering my application.
                                </p>

                                <p>Sincerely,</p>
                                <p className="font-bold mb-2">{val.name}</p>
                                <div className="flex items-center">
                                  <p className="uppercase text-sm text-black font-bold">
                                    Resume / CV :
                                  </p>
                                  <button
                                    onClick={() =>
                                      window.open(userDetails.cv, "_blank")
                                    }
                                    className=" ml-1 px-4 py-1 border border-pink-300 rounded-lg shadow hover:bg-gray-200 hover:border-gray-300"
                                  >
                                    {val.name}_CV
                                  </button>
                                </div>
                              </Modal>
                              <button className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none">
                                Connect
                              </button>
                            </div>
                          </div>
                          <p className="flex justify-end text-xs text-gray-500">
                            {formatDate(val.appliedDate)}
                          </p>
                        </div>
                      ))
                    : null}
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
