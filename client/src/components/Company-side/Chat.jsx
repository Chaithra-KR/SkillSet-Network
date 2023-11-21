import { useEffect, useRef, useState } from "react";
import { CompanyApi } from "../../configs/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { io } from "socket.io-client";
import { Button, Modal } from "antd";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [seeker, setSeeker] = useState([]);
  const [user, setUser] = useState("");
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const messageRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSeekers, setShowSeekers] = useState(false);

  const { companyToken, companyName } = useSelector((state) => ({
    companyToken: state?.companyDetails.companyToken,
    companyName: state?.companyDetails.companyName,
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

    const fetchSeekers = async () => {
      try {
        const res = await axios.get(
          `${CompanyApi}seekers?data=${encodeURIComponent(companyToken)}`
        );
        setUser(res.data.company);
        setSeeker(res.data.seekers);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${CompanyApi}getChat?data=${encodeURIComponent(companyToken)}`
        );
        const resData = res.data.receiverData;
        setConversations(resData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeekers();
    fetchConversations();
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [companyToken, selectedSeeker]);

  const sendMessage = async (receiver) => {
    try {
      if (!selectedSeeker) {
        return;
      }

      const seekerId = receiver;

      socket.emit("send", message, messages?.conversationId, seekerId);

      const res = await axios.post(`${CompanyApi}sendMessage`, {
        conversationId: messages?.conversationId,
        senderId: companyToken,
        receiverId: seekerId,
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
      `${CompanyApi}getMessage/${conversationId}?senderId=${companyToken}&&receiverId=${receiver}`
    );
    const resData = res.data.messageCompanyData;
    console.log(resData);
    setMessages({ resData, receiver, conversationId });
    setSelectedSeeker(receiver);
  };

  const handleSeekerClick = (seeker) => {
    setSelectedSeeker(seeker);
    fetchMessages("new", seeker);
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
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
                  {user?.company || "No Company Data"}
                </h3>
                <p className="text-lg font-light">My Account</p>
              </div>
            </div>
            <hr className="sm:hidden" />
            <div className="flex justify-end mt-5">
              {showSeekers ? (
                <button
                  onClick={() => {
                    setShowSeekers(false);
                  }}
                  className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
                >
                  Messages
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSeekers(true);
                  }}
                  className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
                >
                  People
                </button>
              )}
            </div>
            <div className="mx-4 sm:mx-14 mt-5">
              {showSeekers ? (
                <>
                  <div className="text-primary text-lg">Peoples</div>
                  <div>
                    {seeker && seeker.length > 0 ? (
                      seeker.map((seeker) => {
                        return (
                          <div
                            className=" flex flex-col sm:flex-row items-center py-8 border-b border-b-gray-300"
                            key={seeker._id}
                          >
                            <div
                              className="cursor-pointer flex items-center"
                              onClick={() => {
                                handleSeekerClick(seeker);
                                handleCancel();
                              }}
                            >
                              <div>
                                {seeker.image ? (
                                  <img
                                    src={seeker.image}
                                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                    alt="seeker Image"
                                  />
                                ) : (
                                  <img
                                    src="/profile.png"
                                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                    alt="seeker Image"
                                  />
                                )}
                              </div>
                              <div className="ml-4 sm:ml-6">
                                <h3 className="text-lg font-semibold">
                                  {seeker?.username}
                                </h3>
                                <p className="text-sm font-light text-gray-600">
                                  {seeker?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                        No Seekers
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
                      const { seeker, conversationId } = conversation;
                      return (
                        <div
                          key={conversationId}
                          className="flex flex-col sm:flex-row items-center py-8 border-b border-gray-300"
                        >
                          <div
                            className="cursor-pointer flex items-center"
                            onClick={() => {
                              fetchMessages(conversationId, seeker);
                              handleCancel();
                            }}
                          >
                            <div>
                              {seeker.image ? (
                                <img
                                  src={seeker.image}
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              ) : (
                                <img
                                  src="/profile.png"
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              )}
                            </div>
                            <div className="ml-4 sm:ml-6">
                              <h3 className="text-lg font-semibold">
                                {seeker.username}
                              </h3>
                              <p className="text-sm font-light text-gray-600">
                                {seeker.email}
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
              <img
                src={user.image || "/profile.png"}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-2 border border-primary"
                alt="User Image"
              />
            </div>
            <div className="ml-4 sm:ml-8">
              <h3 className="text-2xl">{user?.company || "No company Data"}</h3>
              <p className="text-lg font-light">My Account</p>
            </div>
          </div>
          <hr className="sm:hidden" />
          <div className="flex justify-end mt-5">
            {showSeekers ? (
              <button
                onClick={() => {
                  setShowSeekers(false);
                }}
                className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
              >
                Messages
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowSeekers(true);
                }}
                className="bg-pink-500 text-sm text-white px-3 py-1 rounded-md"
              >
                Peoples
              </button>
            )}
          </div>
          <div className="mx-4 sm:mx-14 mt-5">
            {showSeekers ? (
              <>
                <div className="text-primary text-lg">Peoples</div>
                <div className="peoples">
                  {seeker && seeker.length > 0 ? (
                    seeker.map((seeker) => {
                      return (
                        <div
                          className="flex flex-col sm:flex-row items-center py-8 border-b border-b-gray-300"
                          key={seeker._id}
                        >
                          <div
                            className="cursor-pointer flex items-center"
                            onClick={() => handleSeekerClick(seeker)}
                          >
                            <div>
                              {seeker.image ? (
                                <img
                                  src={seeker.image}
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              ) : (
                                <img
                                  src="/profile.png"
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              )}
                            </div>
                            <div className="ml-4 sm:ml-6">
                              <h3 className="text-lg font-semibold">
                                {seeker?.username}
                              </h3>
                              <p className="text-sm font-light text-gray-600">
                                {seeker?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-lg font-semibold mt-4 sm:mt-24">
                      No Seekers
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
                      const { seeker, conversationId } = conversation;
                      return (
                        <div
                          key={conversationId}
                          className="flex flex-col sm:flex-row items-center py-8 border-b border-gray-300"
                        >
                          <div
                            className="cursor-pointer flex items-center"
                            onClick={() =>
                              fetchMessages(conversationId, seeker)
                            }
                          >
                            <div>
                              {seeker.image ? (
                                <img
                                  src={seeker.image}
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              ) : (
                                <img
                                  src="/profile.png"
                                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-2 border border-primary"
                                  alt="seeker Image"
                                />
                              )}
                            </div>
                            <div className="ml-4 sm:ml-6">
                              <h3 className="text-lg font-semibold">
                                {seeker.username}
                              </h3>
                              <p className="text-sm font-light text-gray-600">
                                {seeker.email}
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
            {selectedSeeker ? (
              <div className="flex justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                  <div className="relative">
                    {selectedSeeker.image ? (
                      <img
                        src={selectedSeeker.image}
                        className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        alt={selectedSeeker.username}
                      />
                    ) : (
                      <img
                        src="/profile.png"
                        className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        alt="Default seeker Image"
                      />
                    )}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="text-sm sm:text-lg mt-1 flex items-center">
                      <span className="text-gray-700 mr-3">
                        {selectedSeeker.username}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {" "}
                      {selectedSeeker.email}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            <div id="messages">
              {selectedSeeker ? (
                <div className="flex flex-col h-96 sm:h-[550px] p-3 space-y-4 overflow-y-scroll">
                  {messages &&
                  messages.resData &&
                  messages.resData.length > 0 ? (
                    messages.resData.map((message, index) => (
                      <div key={index}>
                        {seeker.map((seeker) => (
                          <div key={seeker.username} className="chat-message">
                            {message.company.company !== companyName &&
                            selectedSeeker.username === seeker.username ? (
                              <div className="flex items-end">
                                <div className="flex flex-col space-y-2 text-xs sm:text-sm max-w-xs mx-2 order-2 items-start">
                                  {message.company.company !== companyName && (
                                    <div>
                                      <span className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg inline-block rounded-bl-none bg-gray-400 text-black">
                                        {message.message}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <img
                                  src={seeker.image || "/profile.png"}
                                  alt="seeker image"
                                  className="w-7 h-7 rounded-full order-1"
                                />
                              </div>
                            ) : null}
                          </div>
                        ))}

                        <div className="chat-message">
                          {message.company.company === companyName ? (
                            <div className="flex items-end justify-end">
                              <div className="flex flex-col space-y-2 text-xs sm:text-sm max-w-xs mx-2 order-1 items-end">
                                {message.company.company === companyName && (
                                  <div>
                                    <span className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg inline-block rounded-br-none bg-pink-400 text-white ">
                                      {message.message}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <img
                                src={message.company.image || "/profile.png"}
                                alt={message.company.company}
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

            {selectedSeeker ? (
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
                    onClick={() => sendMessage(selectedSeeker)}
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
    </>
  );
};

export default Chat;
