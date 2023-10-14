import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserApi } from "../../configs/api";
import axios from "axios";

const SinglePostView = () => {
  const [userDetails, setUserDetails] = useState({
    caption: null,
    picture: null,
    postDate: null,
    commentSection: null,
  });

  const [showComment, SetShowComment] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const imageId = queryParams.get("imageId");

  const commentCount = userDetails.commentSection
    ? userDetails.commentSection.length
    : 0;

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await axios
          .get(`${UserApi}singlePost?imageId=${imageId}`)
          .then((res) => {
            let postData = res.data.seekerData;
            setUserDetails(postData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [imageId]);

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
    <div>
      <div class="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div class="xl:w-2/6 lg:w-2/5 w-80 md:block hidden relative p-4">
          <div class="group cursor-pointer">
            <img
              class="mt-6 w-full transform transition-transform duration-300 group-hover:scale-110"
              alt="post"
              src={userDetails.picture}
            />
          </div>
        </div>

        <div class="md:hidden">
          <img
            class="w-full"
            alt="image of a girl posing"
            src={userDetails.picture}
          />
        </div>
        <section class="bg-white dark:bg-gray-900 lg:w-[500px] xl:w-[600px]">
          <div class="max-w-2xl mx-auto px-4">
            <div class=" mb-6">
              <p className="text-end text-gray-400">
                {formatDate(userDetails.postDate)}
              </p>
              <h2 class="text-lg lg:text-lg font-semibold text-gray-900 dark:text-white">
                {userDetails.caption}
              </h2>
            </div>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({commentCount})
              </h2>
            </div>

            <button
              onClick={() => {
                SetShowComment(true);
              }}
              class="inline-flex items-center mb-3 py-2.5 px-4 text-xs font-medium text-center text-white bg-pink-400 rounded-lg hover:bg-primary-800"
            >
              Show comments
            </button>
            {showComment ? (
              <div className="h-[500px] overflow-y-auto">
                {userDetails.commentSection &&
                  userDetails.commentSection.map((val) => (
                    <article
                      key={val._id}
                      class="p-6 text-base bg-white border-t lg:w-[400px] xl:w-[500px] border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <footer class="flex justify-between items-center mb-2">
                        <div class="flex items-center">
                          <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                            {val.company.image ? (
                              <img
                                class="mr-2 w-6 h-6 rounded-full"
                                src={val.company.image}
                                alt="Helene Engels"
                              />
                            ) : (
                              <img
                                class="mr-2 w-6 h-6 rounded-full"
                                src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                                alt="Helene Engels"
                              />
                            )}

                            {val.company.name}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            <time datetime="2022-06-23" title="June 23rd, 2022">
                              {formatDate(val.commentDate)}
                            </time>
                          </p>
                        </div>
                      </footer>
                      <p class="text-gray-500 dark:text-gray-400 pl-8">
                        {val.comment}
                      </p>
                    </article>
                  ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SinglePostView;
