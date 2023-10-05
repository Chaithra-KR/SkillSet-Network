import { useEffect, useRef, useState } from "react";
import { UserApi } from "../../configs/api";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const seeker = useSelector((state) => state?.seekerDetails.seekerToken);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const messageRef = useRef(null);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    fetchMessages("new", company._id);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${UserApi}companies?data=${encodeURIComponent(seeker)}`
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
          `${UserApi}getChat?data=${encodeURIComponent(seeker)}`,
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
  }, [seeker, messages?.length]);

  const sendMessage = async (receiver) => {
    try {
      console.log(receiver);
      const companyId = messages?.receiver;
      const res = await axios.post(`${UserApi}sendMessage`, {
        conversationId: messages?.conversationId,
        senderId: seeker,
        receiverId: companyId,
        message,
      });

    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (conversationId, receiver) => {
    console.log("conversationId:", conversationId, "receiver:", receiver);
    const res = await axios.get(
      `${UserApi}getMessage/${conversationId}?senderId=${seeker}&&receiverId=${receiver}`
    );
    const resData = res.data.messageCompanyData;
    setMessages({ messages: resData, receiver, conversationId });
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
            <h3 className="text-2xl">{user?.username || "No Company Data"}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {/* {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div className="flex items-center py-8 border-b border-b-gray-300">
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => fetchMessages(conversationId, user)}
                    >
                      <div>
                        <img
                          src={Img1}
                          className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold">
                          {user?.fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {user?.email}
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
            )} */}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {selectedCompany ? (
          <div className="w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2">
            <div className="cursor-pointer">
              <div>
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
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{selectedCompany.company}</h3>
              <p className="text-sm font-light text-gray-600">
                {selectedCompany.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-phone-outgoing"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="black"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <line x1="15" y1="9" x2="20" y2="4" />
                <polyline points="16 4 20 4 20 8" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold mt-24">
            No Messages or No Conversation Selected
          </div>
        )}

        <div className="h-[75%] w-full shadow-sm">
          <div className="p-14">
            {selectedCompany ? (
              <>
                <div
                  className={`max-w-[40%] rounded-b-xl p-4 mb-6 
                      ? "bg-primary text-white rounded-tl-xl ml-auto"
                      : "bg-secondary rounded-tr-xl"
                  } `}
                >
                  {message}
                </div>
                <div ref={messageRef}></div>
              </>
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Company Selected
              </div>
            )}
          </div>
        </div>
        {selectedCompany ? (
          <div className=" w-[600px] flex items-center border shadow-md rounded-full bg-gray-300 ">
            <input
              placeholder=" Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-[75%] p-4 bg-gray-300 rounded-full"
            />
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
                !message && "pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={() => sendMessage(selectedCompany._id)}
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
        <div className="text-primary text-lg">People</div>
        <div>
          {companies && companies.length > 0 ? (
            companies.map((company) => {
              return (
                <div
                  className="flex items-center py-8 border-b border-b-gray-300"
                  key={company._id}
                >
                  <div
                    className="cursor-pointer flex items-center"
                    // onClick={() => fetchMessages("new", company._id)}
                    onClick={() => handleCompanyClick(company)}
                  >
                    <div>
                      {company.image ? (
                        <img
                          src={company.image}
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
            <div className="text-center text-lg font-semibold mt-24">
              No Companies
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
