import { useEffect, useRef, useState } from "react";
import { CompanyApi } from "../../configs/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPaperPlane, FaPhone } from "react-icons/fa";
import { io } from "socket.io-client";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [seeker, setSeeker] = useState([]);
  const [user, setUser] = useState("");
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const messageRef = useRef(null);

  const { companyToken, companyName } = useSelector((state) => ({
    companyToken: state?.companyDetails.companyToken,
    companyName: state?.companyDetails.companyName,
  }));

  const socket = io("http://localhost:4000");

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
  }, [companyToken]);

  const sendMessage = async (receiver) => {
    try {
      const seekerId = receiver;
      
      socket.emit("send", message, messages?.conversationId, companyToken);

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
  }

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

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-8 mx-14">
          <div>
            {user.image ? (
              <img
                src={user.image}
                className="w-[100px] h-[100px] rounded-full p-[2px] border border-primary"
              />
            ) : (
              <img
                src="/profile.png"
                className="w-[100px] h-[100px] rounded-full p-[2px] border border-primary"
              />
            )}
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">{user?.company || "No Company Data"}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>

          <div>
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation) => {
                const { seeker, conversationId } = conversation;
                return (
                  <div
                    key={conversationId}
                    className="flex items-center py-8 border-b border-gray-300"
                  >
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => fetchMessages(conversationId, seeker)}
                    >
                      <div>
                        {seeker.image ? (
                          <img
                            src={seeker.image}
                            className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                          />
                        ) : (
                          <img
                            src="/profile.png"
                            className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                          />
                        )}
                      </div>
                      <div className="ml-6">
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
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {selectedSeeker ? (
          <div className="w-full bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2">
            <div className="cursor-pointer">
              <div>
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
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{selectedSeeker.username}</h3>
              <p className="text-sm font-light text-gray-600">
                {selectedSeeker.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <FaPhone />
            </div>
          </div>
        ) : null}
        <div className="h-[70%] w-full">
          <div className="px-10">
            {selectedSeeker ? (
              <>
                {messages && messages.resData && messages.resData.length > 0 ? (
                  messages.resData.map((message, index) => (
                    <div className="flex" key={index}>
                      {seeker.map((seeker) => (
                        <div key={seeker.username}>
                          {message.company.company !== companyName &&
                          selectedSeeker.username === seeker.username ? (
                            <img
                              src={seeker.image || "/profile.png"}
                              alt={seeker.username}
                              className="w-[32px] mr-2 h-[32px] rounded-full"
                            />
                          ) : null}
                        </div>
                      ))}
                      <div
                        className={`max-w-[40%] rounded-b-xl flex p-2 mb-5 ${
                          message.company.company === companyName
                            ? "bg-gray-300 text-black rounded-tl-xl ml-auto"
                            : "bg-pink-400 text-white rounded-tr-xl"
                        }`}
                      >
                        {message.message}
                        <br />
                      </div>
                      {message.company.company === companyName ? (
                        <>
                          <img
                            src={message.company.image || "/profile.png"}
                            alt={message.company.company}
                            className="w-[32px] ml-2 h-[32px] rounded-full"
                          />
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-lg font-semibold">
                    No Messages
                  </div>
                )}
                <div ref={messageRef}></div>
              </>
            ) : (
              <div className="flex justify-center items-center h-[300px] text-lg font-semibold">
                <p>Please select a contact!</p>
              </div>
            )}
          </div>
        </div>

        {selectedSeeker ? (
          <div className=" w-[700px] flex items-center mb-5 ">
            <input
              placeholder=" Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-gray-300 rounded-full"
            />
            <div
              className={`ml-4 p-2 cursor-pointer ${
                !message && "pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={() => sendMessage(selectedSeeker._id)}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 transition duration-500 ease-in-out text-white bg-pink-500 hover:bg-pink-400 focus:outline-none"
              >
                <span className="font-bold pr-2">Send</span>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="w-[25%] h-screen bg-gray-50 px-8 py-16 overflow-scroll">
        <div className="text-primary text-lg">Companies</div>
        <div>
          {seeker && seeker.length > 0 ? (
            seeker.map((seeker) => {
              return (
                <div
                  className="flex items-center py-8 border-b border-b-gray-300"
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
                          className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        />
                      ) : (
                        <img
                          src="/profile.png"
                          className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        />
                      )}
                    </div>
                    <div className="ml-6">
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
            <div className="text-center text-lg font-semibold mt-24">
              No seekers
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
