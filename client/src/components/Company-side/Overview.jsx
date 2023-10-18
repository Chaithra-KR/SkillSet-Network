import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { CompanyApi } from "../../configs/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [jobsActiveTab, setJobsActiveTab] = useState(true);
  const [hirePoolActiveTab, setHirePoolActiveTab] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [applicantData, setApplicantData] = useState([]);
  const [employees, setEmployees] = useState([]);
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

  const openModal = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  const data = useSelector((state) => {
    return state?.companyDetails.companyToken;
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

  const handleUserProfileView = (userId) => {
    navigate(`/company/view-userProfile?userId=${userId}`);
  };

  const handleOpenChat = () => {
    navigate(`/company/chat-with-seeker`);
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await axios.get(
          `${CompanyApi}companyProfile?data=${encodeURIComponent(data)}`
        );
        setCompanyDetails(response.data.companyData);
        setApplicantData(response.data.applicantData);
        setEmployees(response.data.Employees);
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mt-4 lg:mt-8 mb-4">
        <div className="flex flex-wrap">
          <div>
            <button
              className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                jobsActiveTab === true
                  ? "bg-pink-400 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => {
                setJobsActiveTab(true);
                setHirePoolActiveTab(false);
                setShowEmployees(false);
              }}
            >
              Jobs
            </button>
            <button
              className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                hirePoolActiveTab === true
                  ? "bg-pink-400 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => {
                setHirePoolActiveTab(true);
                setJobsActiveTab(false);
                setShowEmployees(false);
              }}
            >
              Hire pool
            </button>
            <button
              className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                showEmployees === true
                  ? "bg-pink-400 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => {
                setHirePoolActiveTab(false);
                setJobsActiveTab(false);
                setShowEmployees(true);
              }}
            >
              Employees
            </button>
          </div>
        </div>
      </div>
      <div className="mx-10  h-screen">
        {jobsActiveTab === true ? (
          <section className="">
            {companyDetails.jobs
              ? companyDetails.jobs.map((val, i) => (
                  <li className="w-full md:w-1/3 list-none" key={i}>
                    <div className="box mb-4 p-4 text-center shadow-md">
                      <p className="text-sm text-end pb-1 text-gray-400">
                        Shared date : {formatDate(val.date)}
                      </p>
                      <div className="bg-pink-50 h-32 mb-2">
                        <h3 className="title text-lg font-semibold">
                          {val.position}
                        </h3>
                        <div>
                          <h4>Skills</h4>
                          <p>
                            {val.skills.map((skill, i) => (
                              <>
                                {skill}
                                {val.skills.length - 1 === i ? "" : ", "}
                              </>
                            ))}
                          </p>
                        </div>
                        <p className="price text-xl font-semibold">
                          {val.time}
                        </p>
                      </div>

                      <p className="price text-xl font-semibold">
                        {" "}
                        Salary: Rs.{val.salary}/-
                      </p>
                    </div>
                  </li>
                ))
              : null}
          </section>
        ) : null}
        {hirePoolActiveTab === true ? (
          <section>
            {applicantData.length > 0
              ? applicantData.map((val) => (
                  <div className="p-4 bg-white rounded-lg shadow-md mb-3 w-6/12">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {val.user.image ? (
                          <img
                            className="rounded-full w-24 h-18 mx-auto flex items-center justify-center border-persian-orange p-2"
                            src={val.user.image}
                            alXt="user"
                          />
                        ) : (
                          <img
                            className="rounded-full w-24 h-24 mx-auto flex items-center justify-center border-persian-orange p-2"
                            src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                            alt="user"
                          />
                        )}
                        <div>
                          <p>
                            <scan className="font-semibold">
                              {val.user.username}{" "}
                            </scan>{" "}
                            applied for the position{" "}
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
                            <span className="font-bold mr-1">Subject :</span>{" "}
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
                            . I am eager to bring these skills to your company
                            and contribute to your team's success.
                          </p>

                          <p className="mb-1">
                            I am available for an interview at{" "}
                            <span className="font-bold mr-1">{val.phone}</span>{" "}
                            or via email at{" "}
                            <span className="font-bold mr-1">{val.email}</span>.
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
        ) : null}
        {showEmployees === true ? (
          <ul className="mt-2 flex flex-wrap">
            {employees.length > 0 ? ( // Add parentheses here
              employees.map((employee, i) => (
                <li
                  className="w-56 p-4 bg-white rounded-lg shadow-md mr-4 mb-4"
                  key={i}
                >
                  <div className="text-center">
                    {employee.image ? (
                      <img
                        className="rounded-full w-24 h-24 mx-auto border-2 border-persian-orange p-2"
                        src={employee.image}
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
                      {employee.username}
                    </h3>
                    <div className="mt-2">
                      <p>{employee.headline}</p>
                    </div>
                    <div>
                      <h3 className="font-bold">Skills</h3>
                      <p className="text-sm">
                        {employee.skills.map((skill, i) => (
                          <>
                            {skill}
                            {employee.skills.length - 1 === i ? "" : ", "}
                          </>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleOpenChat}
                      className="bg-color3 text-black hover:text-white border rounded px-4 py-2 hover:bg-pink-500"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => {
                        handleUserProfileView(employee._id);
                      }}
                      className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2 ml-2"
                    >
                      Profile
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No employees found</p>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Overview;
