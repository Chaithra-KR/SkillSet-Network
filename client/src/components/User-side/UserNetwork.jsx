import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { FaUsers, FaNetworkWired, FaBell } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserNetwork = () => {
  const [current, setCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [connections, showConnections] = useState(false);
  const [receivedRequest, showReceivedRequest] = useState(false);
  const [requestByYou, showRequestByYou] = useState(false);

  const navigate = useNavigate();
  const token = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  useEffect(() => {
    const handleNetwork = async () => {
      try {
        const response = await axios.get(
          `${UserApi}visitNetwork?data=${encodeURIComponent(token)}`
        );
        setCurrent(response.data.currentUser);
        setUsers(response.data.Users);
        setRequests(response.data.Requests);
      } catch (error) {
        console.log(error);
      }
    };
    handleNetwork();
  }, [refresh]);

  const handleConnectionRequest = async (userId) => {
    try {
      const data = {
        token: token,
        recipientUserId: userId,
      };
      const response = await axios.post(`${UserApi}sendConnectionRequest`, {
        data: data,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 3000,
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConnectionRequest = async (userId) => {
    try {
      const data = {
        token: token,
        userId: userId,
      };
      const response = await axios.post(`${UserApi}acceptConnectionRequest`, {
        data: data,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 3000,
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const regex = new RegExp(query, "i");
    const filtered = query
      ? users.filter((user) => regex.test(user.username))
      : users;

    setFilteredUsers(filtered);
  };

  const handleUserProfileView = (userId) => {
    navigate(`/the-seeker?userId=${userId}`);
  };

  return (
    <div className="w-full h-screen bg-white">
      <div className="flex justify-center">
        <div className="mx-2 ">
          <div className="flex flex-wrap justify-between py-3  max-[1234px]:flex-col ">
            <div className="flex flex-wrap max-[561px]:justify-center m-auto md:m-0 md:ms-3 md:mb-4 gap-3 mb-5">
              <button
                onClick={() => {
                  showConnections(false);
                  showReceivedRequest(false);
                  showRequestByYou(false);
                }}
                className={`text-xs md:text-base sm:ml-2 w-36 max-md:w-32 border border-transparent bg-gray-100 rounded flex px-2 py-1 flex-raw items-center justify-center ${
                  !connections && !requestByYou && !receivedRequest
                    ? "bg-pink-400 text-white"
                    : ""
                }`}
              >
                <FaNetworkWired
                  className={`fill-current text-pink-500 mx-1${
                    !connections && !requestByYou && !receivedRequest
                      ? "bg-white text-white mx-1"
                      : ""
                  }`}
                />
                Seekers
              </button>
              <button
                onClick={() => {
                  showConnections(true);
                  showRequestByYou(false);
                  showReceivedRequest(false);
                }}
                className={`text-xs md:text-base ml-2 w-36 max-md:w-32  border border-transparent bg-gray-100 rounded flex px-2 py-1 flex-raw items-center justify-center ${
                  connections ? "bg-pink-400 text-white" : ""
                }`}
              >
                <FaUsers
                  className={`fill-current text-pink-500 mx-1${
                    connections ? "bg-white text-white mx-1" : ""
                  }`}
                />
                Connections
              </button>
              <button
                onClick={() => {
                  showReceivedRequest(true);
                  showRequestByYou(false);
                  showConnections(false);
                }}
                className={`text-xs md:text-base ml-2 w-36 max-md:w-32  border border-transparent bg-gray-100 rounded flex px-2 py-1 flex-raw items-center justify-center ${
                  receivedRequest ? "bg-pink-400 text-white" : ""
                }`}
              >
                <FaBell
                  className={`fill-current text-pink-500 mx-1${
                    receivedRequest ? "bg-white text-white mx-1" : ""
                  }`}
                />
                Requests
              </button>
              <button
                onClick={() => {
                  showConnections(false);
                  showRequestByYou(true);
                  showReceivedRequest(false);
                }}
                className={`text-xs md:text-base ml-2 w-36 max-md:w-32  border border-transparent bg-gray-100 rounded flex px-2 py-1 flex-raw items-center justify-center ${
                  requestByYou ? "bg-pink-400 text-white" : ""
                }`}
              >
                <IoMdSend
                  className={`fill-current text-pink-500 mx-1${
                    requestByYou ? "bg-white text-white mx-1" : ""
                  }`}
                />
                Requested to
              </button>
            </div>
            <div className="md:me-3 mx-7 justify-center flex">
              <input
                id="user"
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={handleSearch}
                className="border rounded-lg px-4 py-2 w-full sm:w-64 md:w-96 focus:outline-none focus:border-pink-300"
              />
            </div>
          </div>

          <div className="bg-gray-100  w-full md:w-[800px] xl:w-[1200px] rounded p-5 h-[550px] overflow-y-auto">
            {connections && !requestByYou && (
              <div>
                <h2 className="text-lg font-semibold">Your connections</h2>

                <ul className="mt-2 flex flex-wrap">
                  {users
                    .filter((val) => {
                      return current.connections.some((value) => {
                        return (
                          (value.sendedRequest === val._id &&
                            value.sendedStatus === "accepted") ||
                          (value.receivedRequest === val._id &&
                            value.receivedStatus === "accepted")
                        );
                      });
                    })
                    .map((val, i) => (
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
                              src="/profile.png"
                              alt="user"
                            />
                          )}

                          {current.connections.find((value) => {
                            return (
                              (value.sendedRequest === val._id &&
                                value.sendedStatus === "accepted") ||
                              (value.receivedRequest === val._id &&
                                value.receivedStatus === "accepted")
                            );
                          }) ? (
                            <>
                              <p className="bg-pink-500 text-sm mt-2 text-white mx-14 rounded-md">
                                {" "}
                                Friends
                              </p>
                              <h3 className="text-xl font-semibold mt-1">
                                {val.username}
                              </h3>
                              <div className="mt-2">
                                <p>{val.headline}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="text-xl font-semibold mt-4">
                                {val.username}
                              </h3>
                              <div className="mt-2">
                                <p>{val.headline}</p>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="mt-4 text-center">
                          {current.connections.find((value) => {
                            return (
                              (value.sendedRequest === val._id &&
                                value.sendedStatus === "accepted") ||
                              (value.receivedRequest === val._id &&
                                value.receivedStatus === "accepted")
                            );
                          }) ? (
                            <a
                              href={`mailto:${val.email}`}
                              className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2"
                            >
                              In mail
                            </a>
                          ) : null}

                          <button
                            onClick={() => {
                              handleUserProfileView(val._id);
                            }}
                            className="border rounded text-black hover-bg-pink-500 hover:text-white px-4 py-2 ml-2"
                          >
                            Profile
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {receivedRequest && !connections && !requestByYou && (
              <>
                {requests.length > 0 ? (
                  <div>
                    {requests.map((element, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white w-auto rounded-lg shadow-md mb-3"
                      >
                        <div className="flex justify-between  items-center">
                          <div className="flex items-center space-x-2">
                            {element.image ? (
                              <img
                                className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                src={element.image}
                                alt="user"
                              />
                            ) : (
                              <img
                                className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                                src="/profile.png"
                                alt="user"
                              />
                            )}
                            <div className="flex justify-between items-center sm:text-base text-xs">
                              <p>
                                <span className="font-semibold">
                                  {element && element.username}{" "}
                                </span>{" "}
                                wants to join your network!{" "}
                              </p>
                              <div className="text-white mt-2 pl-8 ">
                                <button
                                  onClick={() => {
                                    handleUserProfileView(element._id);
                                  }}
                                  className="bg-pink-300  px-3 py-1  rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                                >
                                  Visit profile
                                </button>
                                {current.connections.find((value) => {
                                  return (
                                    value.receivedRequest === element._id &&
                                    value.receivedStatus === "requested"
                                  );
                                }) ? (
                                  <button
                                    onClick={() => {
                                      handleAcceptConnectionRequest(
                                        element._id
                                      );
                                    }}
                                    className="bg-pink-300 ml-4 px-3 py-1  rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                                  >
                                    Accept
                                  </button>
                                ) : (
                                  <button className="bg-pink-600 text-white px-3 py-1 ml-2 mt-2 rounded-md hover-bg-pink-500 transition-colors duration-300 focus:outline-none">
                                    Accepted
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <img
                      src="/no-data-found.jpeg"
                      alt="No Data Found"
                      className="w-80 h-80 my-10 mx-auto"
                    />
                    <p className="text-center text-lg font-bold text-pink-700">
                      No requests found!
                    </p>
                  </div>
                )}
              </>
            )}
            {requestByYou && !connections && (
              <div>
                <h2 className="text-lg font-semibold">Pending Requests</h2>
                <ul className="mt-2 flex flex-wrap">
                  {users.map((val, i) => {
                    const hasPendingRequest = current.connections.some(
                      (value) => {
                        return (
                          value.sendedRequest === val._id &&
                          value.sendedStatus === "requested"
                        );
                      }
                    );

                    if (hasPendingRequest) {
                      return (
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
                                src="/profile.png"
                                alt="user"
                              />
                            )}

                            <h3 className="text-xl font-semibold mt-4">
                              {val.username}
                            </h3>
                            <div className="mt-2">
                              <p>{val.headline}</p>
                            </div>
                          </div>

                          <div className="mt-4 text-center">
                            <button className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2">
                              Pending
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
                      );
                    }
                  })}
                </ul>
              </div>
            )}

            {!connections && !requestByYou && !receivedRequest && (
              <div>
                <h2 className="text-lg font-semibold">
                  Let's expand your network!
                </h2>

                <ul className="mt-2 flex flex-wrap">
                  {searchQuery
                    ? filteredUsers.map((val, i) => (
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
                                src="/profile.png"
                                alt="user"
                              />
                            )}
                            {current.connections.find((value) => {
                              return (
                                (value.sendedRequest === val._id &&
                                  value.sendedStatus === "accepted") ||
                                (value.receivedRequest === val._id &&
                                  value.receivedStatus === "accepted")
                              );
                            }) ? (
                              <>
                                <p className="bg-pink-500 text-sm mt-2 text-white mx-14 rounded-md">
                                  {" "}
                                  Friends
                                </p>
                                <h3 className="text-xl font-semibold mt-1">
                                  {val.username}
                                </h3>
                                <div className="mt-2">
                                  <p>{val.headline}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-semibold mt-4">
                                  {val.username}
                                </h3>
                                <div className="mt-2">
                                  <p>{val.headline}</p>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-4 text-center">
                            {current.connections.find((value) => {
                              return (
                                value.sendedRequest === val._id &&
                                value.sendedStatus === "requested"
                              );
                            }) ? (
                              <button className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2">
                                Pending
                              </button>
                            ) : current.connections.find((value) => {
                                return (
                                  (value.sendedRequest === val._id &&
                                    value.sendedStatus === "accepted") ||
                                  (value.receivedRequest === val._id &&
                                    value.receivedStatus === "accepted")
                                );
                              }) ? (
                              <a
                                href={`mailto:${val.email}`}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2"
                              >
                                In mail
                              </a>
                            ) : current.connections.find((value) => {
                                return (
                                  value.receivedRequest === val._id &&
                                  value.receivedStatus === "requested"
                                );
                              }) ? (
                              <button
                                onClick={() => {
                                  handleAcceptConnectionRequest(val._id);
                                }}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2"
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleConnectionRequest(val._id);
                                }}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2 ml-2"
                              >
                                Connect
                              </button>
                            )}

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
                    : users.map((val, i) => (
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
                                src="/profile.png"
                                alt="user"
                              />
                            )}
                            {current.connections.find((value) => {
                              return (
                                (value.sendedRequest === val._id &&
                                  value.sendedStatus === "accepted") ||
                                (value.receivedRequest === val._id &&
                                  value.receivedStatus === "accepted")
                              );
                            }) ? (
                              <>
                                <p className="bg-pink-500 text-sm mt-2 text-white mx-14 rounded-md">
                                  {" "}
                                  Friends
                                </p>
                                <h3 className="text-xl font-semibold mt-1">
                                  {val.username}
                                </h3>
                                <div className="mt-2">
                                  <p>{val.headline}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="text-xl font-semibold mt-4">
                                  {val.username}
                                </h3>
                                <div className="mt-2">
                                  <p>{val.headline}</p>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-4 text-center">
                            {current.connections.find((value) => {
                              return (
                                value.sendedRequest === val._id &&
                                value.sendedStatus === "requested"
                              );
                            }) ? (
                              <button className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2">
                                Pending
                              </button>
                            ) : current.connections.find((value) => {
                                return (
                                  (value.sendedRequest === val._id &&
                                    value.sendedStatus === "accepted") ||
                                  (value.receivedRequest === val._id &&
                                    value.receivedStatus === "accepted")
                                );
                              }) ? (
                              <a
                                href={`mailto:${val.email}`}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2"
                              >
                                In mail
                              </a>
                            ) : current.connections.find((value) => {
                                return (
                                  value.receivedRequest === val._id &&
                                  value.receivedStatus === "requested"
                                );
                              }) ? (
                              <button
                                onClick={() => {
                                  handleAcceptConnectionRequest(val._id);
                                }}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2"
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleConnectionRequest(val._id);
                                }}
                                className="border rounded text-black hover:bg-pink-500 hover:text-white px-4 py-2 ml-2"
                              >
                                Connect
                              </button>
                            )}

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
                      ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNetwork;
