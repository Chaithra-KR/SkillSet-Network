import { useEffect, useRef, useState } from "react";
import { UserApi } from "../../configs/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { io } from "socket.io-client";
import { Button, Modal } from "antd";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({
    resData: [],
    receiver: null,
    conversationId: null,
  });
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPeoples, setShowPeoples] = useState(false);
  const messageRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { seekerName, seekerToken } = useSelector((state) => ({
    seekerToken: state?.seekerDetails.seekerToken,
    seekerName: state?.seekerDetails.seekerName,
  }));

  const socket = io(import.meta.env.VITE_SocketIo);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("error", (err) => {
      console.log(err);
    });
    socket.on("receiver", (message, conversationId, sender) => {
      fetchMessages(conversationId, sender);
    });

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${UserApi}companies?data=${encodeURIComponent(seekerToken)}`
        );
        setUser(res.data.seeker);
        setCompanies(res.data.companies);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${UserApi}getChat?data=${encodeURIComponent(seekerToken)}`
        );
        const resData = res.data.receiverData;
        setConversations(resData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanies();
    fetchConversations();
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [seekerToken, selectedCompany]);

  const sendMessage = async (receiver) => {
    try {
      if (!selectedCompany) {
        return;
      }

      const companyId = receiver;

      socket.emit("send", message, messages?.conversationId, companyId);

      const res = await axios.post(`${UserApi}sendMessage`, {
        conversationId: messages?.conversationId,
        senderId: seekerToken,
        receiverId: companyId,
        message,
      });
      if (res.data.success) {
        setMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (conversationId, receiver) => {
    const res = await axios.get(
      `${UserApi}getMessage/${conversationId}?senderId=${seekerToken}&&receiverId=${receiver}`
    );
    const resData = res.data.messageSeekerData;
    setMessages({ resData, receiver, conversationId });
    setSelectedCompany(receiver);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    fetchMessages("new", company);
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (window.innerWidth < 300) {
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  }, [window.innerWidth]);

  return (
    <div className="w-screen flex">
      <div className="p-3.5 sm:hidden">
        <Button
          onClick={() => {
            showModal();
          }}
        >
          <FaUser />
        </Button>
      </div>
      <Modal open={modalOpen} footer={null} onCancel={handleCancel}>
        <div className="w-full sm:w-[25%] h-screen bg-secondary">
          <div className="flex flex-col sm:flex-row items-center my-8 mx-4 sm:mx-14">
            <div>
              {user.image ? (
                <img
                  src={user.image}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-2 border border-primary"
                  alt="User Image"
                />
              ) : (
                <img
                  src="/profile.png"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-2 border border-primary"
                  alt="User Image"
                />
              )}
            </div>
            <div className="ml-4 sm:ml-8">
              <h3 className="text-2xl">
                {user?.username || "No Company Data"}
              </h3>
              <p className="text-lg font-light">My Account</p>
            </div>
          </div>
          <hr className="sm:hidden" />
          <div className="flex justify-end mt-5">
            {showPeoples ? (
              <button
                onClick={() => {
                  setShowPeoples(false);
                }}
                className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
              >
                Messages
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowPeoples(true);
                }}
                className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
              >
                Peoples
              </button>
            )}
          </div>
          <div className="mx-4 sm:mx-14 mt-5">
            {showPeoples ? (
              <>
                <div className="text-primary text-lg">Peoples</div>
                <div className="peoples">
                  {companies && companies.length > 0 ? (
                    companies.map((company) => {
                      return (
                        <div
                          className="flex flex-col sm:flex-row items-center py-8 border-b border-b-gray-300"
                          key={company._id}
                        >
                          <div
                            className="cursor-pointer flex items-center"
                            onClick={() => {
                              handleCompanyClick(company);
                              handleCancel();
                            }}
                          >
                            <div>
                              {company.image ? (
                                <img
                                  src={company.image}
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="Company Image"
                                />
                              ) : (
                                <img
                                  src="/profile.png"
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="Company Image"
                                />
                              )}
                            </div>
                            <div className="ml-4 sm:ml-6">
                              <h3 className="text-lg font-semibold">
                                {company?.company}
                              </h3>
                              <p className="text-sm font-light text-gray-600">
                                {company?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                      No Companies
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-primary text-lg">Messages</div>
                <div>
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conversation) => {
                      const { company, conversationId } = conversation;
                      return (
                        <div
                          key={conversationId}
                          className="flex flex-col sm:flex-row items-center py-8 border-b border-gray-300"
                        >
                          <div
                            className="cursor-pointer flex items-center"
                            onClick={() => {
                              fetchMessages(conversationId, company);
                              handleCancel();
                            }}
                          >
                            <div>
                              {company.image ? (
                                <img
                                  src={company.image}
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="Company Image"
                                />
                              ) : (
                                <img
                                  src="/profile.png"
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="Company Image"
                                />
                              )}
                            </div>
                            <div className="ml-4 sm:ml-6">
                              <h3 className="text-lg font-semibold">
                                {company.company}
                              </h3>
                              <p className="text-sm font-light text-gray-600">
                                {company.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                      No Conversations
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      <div className={`w-[400px] h-screen ${!menuOpen && "max-sm:hidden"}`}>
        <div className="flex flex-col sm:flex-row items-center my-8 mx-4 sm:mx-14">
          <div>
            {user.image ? (
              <img
                src={user.image}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-2 border border-primary"
                alt="User Image"
              />
            ) : (
              <img
                src="/profile.png"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-2 border border-primary"
                alt="User Image"
              />
            )}
          </div>
          <div className="ml-4 sm:ml-8">
            <h3 className="text-2xl">{user?.username || "No Company Data"}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr className="sm:hidden" />
        <div className="flex justify-end mt-5">
          {showPeoples ? (
            <button
              onClick={() => {
                setShowPeoples(false);
              }}
              className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
            >
              Messages
            </button>
          ) : (
            <button
              onClick={() => {
                setShowPeoples(true);
              }}
              className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
            >
              Peoples
            </button>
          )}
        </div>
        <div className="mx-4 sm:mx-14 mt-5">
          {showPeoples ? (
            <>
              <div className="text-primary text-lg">Peoples</div>
              <div className="peoples">
                {companies && companies.length > 0 ? (
                  companies.map((company) => {
                    return (
                      <div
                        className="flex flex-col sm:flex-row items-center py-8 border-b border-b-gray-300"
                        key={company._id}
                      >
                        <div
                          className="cursor-pointer flex items-center"
                          onClick={() => handleCompanyClick(company)}
                        >
                          <div>
                            {company.image ? (
                              <img
                                src={company.image}
                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                alt="Company Image"
                              />
                            ) : (
                              <img
                                src="/profile.png"
                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                alt="Company Image"
                              />
                            )}
                          </div>
                          <div className="ml-4 sm:ml-6">
                            <h3 className="text-lg font-semibold">
                              {company?.company}
                            </h3>
                            <p className="text-sm font-light text-gray-600">
                              {company?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                    No Companies
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-primary text-lg">Messages</div>
              <div>
                {conversations && conversations.length > 0 ? (
                  conversations.map((conversation) => {
                    const { company, conversationId } = conversation;
                    return (
                      <div
                        key={conversationId}
                        className="flex flex-col sm:flex-row items-center py-8 border-b border-gray-300"
                      >
                        <div
                          className="cursor-pointer flex items-center"
                          onClick={() => fetchMessages(conversationId, company)}
                        >
                          <div>
                            {company.image ? (
                              <img
                                src={company.image}
                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                alt="Company Image"
                              />
                            ) : (
                              <img
                                src="/profile.png"
                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                alt="Company Image"
                              />
                            )}
                          </div>
                          <div className="ml-4 sm:ml-6">
                            <h3 className="text-lg font-semibold">
                              {company.company}
                            </h3>
                            <p className="text-sm font-light text-gray-600">
                              {company.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                    No Conversations
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className=" flex flex-col justify-between my-2">
        <div className="sm:mx-36">
          {selectedCompany ? (
            <div className="flex justify-between py-3 border-b-2 border-gray-200">
              <div className="relative flex items-center space-x-4">
                <div className="relative">
                  {selectedCompany.image ? (
                    <img
                      src={selectedCompany.image}
                      className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                      alt={selectedCompany.company}
                    />
                  ) : (
                    <img
                      src="/profile.png"
                      className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                      alt="Default Company Image"
                    />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="text-sm sm:text-lg mt-1 flex items-center">
                    <span className="text-gray-700 mr-3">
                      {selectedCompany.company}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {" "}
                    {selectedCompany.email}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div id="messages">
            {selectedCompany ? (
              <div className="flex flex-col h-96 sm:h-[550px] p-3 space-y-4 overflow-y-scroll">
                {messages && messages.resData && messages.resData.length > 0 ? (
                  messages.resData.map((message, index) => (
                    <div key={index}>
                      {companies.map((company) => (
                        <div key={company.company} className="chat-message">
                          {message.seeker.username !== seekerName &&
                          selectedCompany.company === company.company ? (
                            <div className="flex items-end">
                              <div className="flex flex-col space-y-2 text-xs sm:text-sm max-w-xs mx-2 order-2 items-start">
                                {message.seeker.username !== seekerName && (
                                  <div>
                                    <span className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg inline-block rounded-bl-none bg-gray-400 text-black">
                                      {message.message}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <img
                                src={company.image || "/profile.png"}
                                alt={company.company}
                                className="w-7 h-7 rounded-full order-1"
                              />
                            </div>
                          ) : null}
                        </div>
                      ))}

                      <div className="chat-message">
                        {message.seeker.username === seekerName ? (
                          <div className="flex items-end justify-end">
                            <div className="flex flex-col space-y-2 text-xs sm:text-sm max-w-xs mx-2 order-1 items-end">
                              {message.seeker.username === seekerName && (
                                <div>
                                  <span className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg inline-block rounded-br-none bg-pink-400 text-white ">
                                    {message.message}
                                  </span>
                                </div>
                              )}
                            </div>
                            <img
                              src={message.seeker.image || "/profile.png"}
                              alt={message.seeker.username}
                              className="w-7 h-7 rounded-full order-2"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-lg font-semibold">
                    No Messages
                  </div>
                )}
                <div ref={messageRef}></div>
              </div>
            ) : (
              <div className="flex justify-center items-center sm:w-[800px] h-[300px] text-sm sm:text-lg font-semibold">
                <p>Please select a contact!</p>
              </div>
            )}
          </div>

          {selectedCompany ? (
            <div className=" w-full sm:w-[800px] flex items-center text-sm sm:text-base ">
              <input
                placeholder=" Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-1 sm:p-3 bg-gray-300 rounded-full"
              />
              <div
                className={`ml-4 p-2 cursor-pointer ${
                  !message && "pointer-events-none"
                }`}
              >
                <button
                  type="button"
                  onClick={() => sendMessage(selectedCompany)}
                  className="inline-flex items-center justify-center rounded-lg px-2 py-1 sm:px-3 sm:py-2 transition duration-500 ease-in-out text-white bg-pink-500 hover:bg-pink-400 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold pr-2">
                    Send
                  </span>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
