import React, { useEffect, useState } from "react";
import { CompanyApi } from "../../configs/api";
import { companyAxiosInstance } from "../../configs/axios/axios";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [notification, setNotification] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedToAccept, setSelectedToAccept] = useState(null);
  const [selectedToReject, setSelectedToReject] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [activeTab, setActiveTab] = useState(true);
  const [refresh, setRefresh] = useState(true);

  const navigate = useNavigate();

  const company = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  useEffect(() => {
    const handleNotificationDetails = async () => {
      try {
        await axios
          .get(`${CompanyApi}notifications?data=${encodeURIComponent(company)}`)
          .then((res) => {
            let applicants = res.data.applicantData;
            let matchedUsers = res.data.matchedUsers;
            let companyData = res.data.companyData;
            setCompanyData(companyData);
            setNotification(applicants);
            setMatchedUsers(matchedUsers);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleNotificationDetails();
  }, [refresh]);

  const handleAccept = async (data) => {
    console.log("data", data);
    axios
      .post(`${CompanyApi}acceptEmployee`, { data: data, company })
      .then((res) => {
        if (res.data.success) {
          setSelectedToAccept(null);
          toast.success(res.data.message, {
            duration: 2000,
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
      });
  };

  const handleReject = async (data) => {
    console.log("data", data);
    axios
      .post(`${CompanyApi}rejectEmployee`, { data: data, company })
      .then((res) => {
        if (res.data.success) {
          setSelectedToReject(null);
          toast.success(res.data.message, {
            duration: 2000,
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
      });
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const openModal = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  const openAcceptModal = (data) => {
    setSelectedToAccept(data);
  };

  const closeAcceptModal = () => {
    setSelectedToAccept(null);
  };

  const openRejectModal = (data) => {
    setSelectedToReject(data);
  };

  const closeRejectModal = () => {
    setSelectedToReject(null);
  };

  const handleUserProfileView = (userId) => {
    navigate(`/company/view-userProfile?userId=${userId}`);
  };

  const handleMessageView = () => {
    navigate("/company/chat-with-seeker");
  };

  return (
    <div className="w-full h-screen mb-10 bg-white">
      <div className="flex flex-col md:flex-row lg:flex-row">
        <div className="w-full  flex justify-center">
          <div className="bg-pink-50 w-full ml-20 rounded p-5 h-screen overflow-y-auto">
            <div className="mb-4">
              <button
                className={`p-1 w-42 px-3 ml-5 border rounded-full shadow-md ${
                  activeTab === true ? "bg-pink-400 text-white" : "bg-gray-300"
                }`}
                onClick={() => {
                  setActiveTab(true);
                }}
              >
                Job Requests
              </button>
              <button
                className={`p-1 w-42 px-3 ml-5 border rounded-full shadow-md ${
                  activeTab === false ? "bg-pink-400 text-white" : "bg-gray-300"
                }`}
                onClick={() => setActiveTab(false)}
              >
                Employee Requests
              </button>
            </div>
            {activeTab ? (
              <div>
                {notification.length > 0
                  ? notification.map((val,i) => (
                      <div key={i} className="p-4 bg-white rounded-lg shadow-md mb-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {val.user && val.user.image ? (
                              <img
                                className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                src={val.user.image}
                                alt="user"
                              />
                            ) : (
                              <img
                                className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                                alt="user"
                              />
                            )}

                            <div>
                              {val.user && val.user.username ? (
                                <>
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
                                </>
                              ) : (
                                <p>User information not available</p>
                              )}
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
                            <button
                              onClick={handleMessageView}
                              className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                            >
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
              </div>
            ) : (
              <div>
                {companyData &&
                companyData.userRequests &&
                companyData.userRequests.length > 0 ? (
                  companyData.userRequests.map((element, i) => (
                    <div className="p-4 bg-white rounded-lg shadow-md mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {element.userId.image ? (
                            <img
                              className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                              src={element.userId.image}
                              alt="user"
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
                                {element.userId.username}{" "}
                              </scan>{" "}
                              requested as an employee at your company{" "}
                            </p>
                          </div>

                          <>
                            {element.status === "pending" ? (
                              <>
                                <div className="space-x-2">
                                  <Button
                                    className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none"
                                    type="pink"
                                    onClick={() => openAcceptModal(element)}
                                  >
                                    Accept
                                  </Button>
                                  <Modal
                                    title="Accept as employee"
                                    visible={selectedToAccept === element}
                                    onCancel={closeAcceptModal}
                                    footer={null}
                                  >
                                    <p>
                                      Are you sure to accept{" "}
                                      {element.userId.username} as an employee
                                      at your company?
                                    </p>
                                    <button
                                      className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none"
                                      type="pink"
                                      onClick={() => {
                                        handleAccept(element.userId._id);
                                      }}
                                    >
                                      Accept
                                    </button>
                                  </Modal>
                                </div>

                                <Button
                                  className="bg-pink-300 text-white px-3 py-1 mt-2 ml-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none"
                                  type="pink"
                                  onClick={() => openRejectModal(element)}
                                >
                                  Reject
                                </Button>
                                <Modal
                                  title="Reject employee request"
                                  visible={selectedToReject === element}
                                  onCancel={closeRejectModal}
                                  footer={null}
                                >
                                  <p>
                                    Are you sure to reject{" "}
                                    {element.userId.username}'s employee request
                                    to your company?
                                  </p>
                                  <button
                                    onClick={() => {
                                      handleReject(element.userId._id);
                                    }}
                                    className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none"
                                    type="pink"
                                  >
                                    Reject
                                  </button>
                                </Modal>
                              </>
                            ) : element.status === "accepted" ? (
                              <button className="bg-pink-600 text-white px-3 py-1 mt-2 rounded-md hover-bg-green-700 transition-colors duration-300 focus:outline-none">
                                Accepted
                              </button>
                            ) : element.status === "rejected" ? (
                              <button className="bg-red-600 text-white px-3 py-1 mt-2 rounded-md hover-bg-red-700 transition-colors duration-300 focus:outline-none">
                                Rejected
                              </button>
                            ) : null}
                          </>
                        </div>
                      </div>
                      <p className="flex justify-end text-xs text-gray-500">
                        {formatDate(element.requestDate)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No user requests found.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-100 w-full mx-20 rounded my-20 p-5 overflow-y-auto">
            <h2 className="text-lg font-semibold">
              Recommended candidates for you!
            </h2>
            <ul className="mt-2 flex flex-wrap">
              {matchedUsers.length > 0
                ? matchedUsers.map((val, i) => (
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

                        <div className="text-xl font-semibold mt-4">
                          {val.username}
                        </div>
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
                        <button
                          onClick={() => {
                            handleUserProfileView(val._id);
                          }}
                          className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2 ml-2"
                        >
                          Profile
                        </button>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
