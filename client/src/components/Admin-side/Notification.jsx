import axios from "axios";
import React, { useEffect, useState } from "react";
import { AdminApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { toast } from "react-hot-toast";
import { adminAxiosInstance } from "../../configs/axios/axios";

const Notification = () => {
  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);

  const admin = useSelector((state) => {
    return state?.adminDetails.adminToken;
  });

  useEffect(() => {
    const notify = async () => {
      try {
        const response = await adminAxiosInstance.get(
          `${AdminApi}postReportedNotify?data=${encodeURIComponent(admin)}`
        );
        setReports(response.data.Reports);
      } catch (error) {
        console.log(error);
      }
    };
    notify();
  }, [refresh]);

  const showModal = (index) => {
    setSelectedReportIndex(index);
  };

  const handleCancel = () => {
    setSelectedReportIndex(null);
  };

  const handleRemoveReportPost = async (postId) => {
    const data = {
      postId: postId,
      token: admin,
    };
    const response = await adminAxiosInstance.post(`${AdminApi}removeReportedPost`, {
      data: data,
    });
    console.log(response, "yt");
    if (response.data.success) {
      if (refresh === true) {
        setRefresh(false);
      } else {
        setRefresh(true);
      }
      toast.success(response.data.message, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#B00043",
          color: "#fff",
        },
      });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <>
      {reports.length > 0 ? (
        <div>
          {reports.map((val, i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 w-full rounded-lg shadow-md mb-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {val.reports &&
                    val.reports.map((data, index) => (
                      <span key={index}>
                        {data.seeker.image ? (
                          <img
                            className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                            src={data.seeker.image}
                            alt="user"
                          />
                        ) : (
                          <img
                            className="rounded-full w-14 h-14 mx-auto flex items-center justify-center border-persian-orange p-2"
                            src="/profile.png"
                            alt="user"
                          />
                        )}
                      </span>
                    ))}

                  <div className="flex justify-between items-center">
                    <p>
                      <span className="font-semibold">
                        {val.reports &&
                          val.reports.map((data, index) => (
                            <span key={index}>
                              <span>{data.seeker.username}</span>
                            </span>
                          ))}
                      </span>{" "}
                      reported a post (
                      <span className="font-semibold">ID: {val._id}</span> ) of{" "}
                      <span className="font-semibold">
                        {val.user && val.user.username}
                      </span>{" "}
                      due to the reason{" "}
                      <span className="font-semibold">
                        {val.reports &&
                          val.reports.map((data, index) => (
                            <span key={index}>
                              <span>{data.reason}</span>
                            </span>
                          ))}
                      </span>{" "}
                    </p>
                    <div className="text-white mt-2">
                      <Button
                        onClick={() => showModal(i)}
                        key={val._id}
                        className="bg-blue-300 ml-4 px-3 py-1 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 focus:outline-none"
                      >
                        View image
                      </Button>

                      <Modal
                        open={selectedReportIndex === i}
                        title="Reported image"
                        footer={null}
                        onCancel={handleCancel}
                      >
                        <p> Post Owner : {val.user && val.user.username}</p>
                        <p>Posted date : {formatDate(val.postDate)}</p>
                        <p>Caption: {val.caption}</p>
                        <p className="pb-1">Post ID : {val._id}</p>
                        <img src={val.picture} alt="" />
                      </Modal>

                      <button
                        onClick={() => {
                          handleRemoveReportPost(val._id);
                        }}
                        className="bg-blue-300 ml-4 px-3 py-1  rounded-md hover:bg-blue-500 transition-colors duration-300 focus:outline-none"
                      >
                        Remove post
                      </button>
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
          <p className="text-center text-lg font-bold text-black">
            No requests found!
          </p>
        </div>
      )}
    </>
  );
};

export default Notification;
