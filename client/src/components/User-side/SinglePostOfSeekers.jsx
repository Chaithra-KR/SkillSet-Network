import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserApi } from "../../configs/api";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";
import { Button, Modal } from "antd";

const SinglePostOfSeekers = () => {
  const [userDetails, setUserDetails] = useState({
    caption: null,
    picture: null,
    postDate: null,
    commentSection: null,
  });
  const [refresh, setRefresh] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const commentCount = userDetails.commentSection
    ? userDetails.commentSection.length
    : 0;

  const navigate = useNavigate();

  const {
    register: commentRegister,
    handleSubmit: commentHandleSubmit,
    formState: commentErrors,
  } = useForm();

  const {
    register: reportRegister,
    handleSubmit: reportHandleSubmit,
    formState: reportErrors,
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const imageId = queryParams.get("imageId");

  const token = useSelector((state) => {
    return state.seekerDetails.seekerToken;
  });

  const handleComments = async (data, e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${UserApi}postComment`, {
        data: data,
        imageId,
        token: token,
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

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await axios.get(
          `${UserApi}singlePost?imageId=${imageId}`
        );
        setUserDetails(response.data.seekerData);
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [imageId, refresh]);

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

  const showModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleReportPost = async (formData, e) => {
    e.preventDefault();
    try {
      const data = {
        token: token,
        postId: imageId,
        reason: formData.reason,
      };
      const response = await axios.post(`${UserApi}reportPost`, { data });
      if (response.data.success) {
        if (refresh === true) {
          setRefresh(false);
        } else {
          setRefresh(true);
        }
        handleCancel();
        toast.success(response.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden relative p-4">
          <div className="group cursor-pointer">
            <img
              className="mt-6 w-full transform transition-transform duration-300 group-hover:scale-110"
              alt="post"
              src={userDetails.picture}
            />
          </div>
        </div>

        <div className="md:hidden">
          <img
            className="w-full"
            alt="image of a girl posing"
            src={userDetails.picture}
          />
        </div>
        <section className="bg-white dark:bg-gray-900 lg:w-[500px] xl:w-[600px]">
          <div className="max-w-2xl mx-auto px-4">
            <div className=" mb-6">
              <p className="text-end text-gray-400">
                {formatDate(userDetails.postDate)}
              </p>
              <h2 className="text-lg lg:text-lg font-semibold text-gray-900 dark:text-white">
                {userDetails.caption}
              </h2>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({commentCount})
              </h2>
              <Button
                onClick={showModal}
                className="inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-pink-500 rounded-lg "
              >
                Report image
                <FaPaperPlane className="fill-current ml-2 text-white" />
              </Button>
              <Modal
                open={modalOpen}
                title="Are you sure ?"
                footer={null}
                onCancel={handleCancel}
              >
                <div>
                  <p>Help us understand what's happening.</p>
                  <form
                    className="my-6"
                    onSubmit={reportHandleSubmit(handleReportPost)}
                  >
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <textarea
                        id="reason"
                        className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write reason..."
                        {...reportRegister("reason", {
                          required: true,
                          pattern: /^.{2,200}$/,
                        })}
                      ></textarea>
                      {reportErrors.reason &&
                        reportErrors.reason.type === "required" && (
                          <label className="text-sm text-red-600">
                            Please enter the reason
                          </label>
                        )}
                      {reportErrors.reason &&
                        reportErrors.reason.type === "pattern" && (
                          <label className="text-sm text-red-600">
                            Please enter a valid reason (minimum 200 characters)
                          </label>
                        )}
                    </div>
                    <button className="inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-pink-500 rounded-lg ">
                      Report image
                      <FaPaperPlane className="fill-current ml-2 text-white" />
                    </button>
                  </form>
                </div>
              </Modal>
            </div>
            <div>
              <form
                className="mb-6"
                onSubmit={commentHandleSubmit(handleComments)}
              >
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <textarea
                    id="comment"
                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                    placeholder="Write a comment..."
                    {...commentRegister("comment", {
                      required: true,
                      pattern: /^.{2,180}$/,
                    })}
                  ></textarea>
                  {commentErrors.comment &&
                    commentErrors.comment.type === "required" && (
                      <label className="text-sm text-red-600">
                        Please enter the comment
                      </label>
                    )}
                  {commentErrors.comment &&
                    commentErrors.comment.type === "pattern" && (
                      <label className="text-sm text-red-600">
                        Please enter a valid comment (maximum 180 characters)
                      </label>
                    )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-pink-400 rounded-lg"
                >
                  Post comment
                </button>
              </form>
            </div>
            <div className="h-[500px] overflow-y-auto">
              {userDetails.commentSection &&
                userDetails.commentSection.map((val) => (
                  <article
                    key={val._id}
                    className="p-6 text-base bg-white border-t lg:w-[400px] xl:w-[500px] border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <footer className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                          {val.company.image ? (
                            <img
                              className="mr-2 w-6 h-6 rounded-full"
                              src={val.company.image || "./profile"}
                              alt="Helene Engels"
                            />
                          ) : (
                            val.image
                          )}

                          {val.company.name ? val.company.name : val.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatDate(val.commentDate)}</span>
                        </p>
                      </div>
                    </footer>
                    <p className="text-gray-500 dark:text-gray-400 pl-8">
                      {val.comment}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SinglePostOfSeekers;
