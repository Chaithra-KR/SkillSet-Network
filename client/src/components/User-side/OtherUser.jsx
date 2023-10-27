import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
} from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { CompanyApi } from "../../configs/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const OtherUser = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    headline: null,
    about: null,
    skills: null,
    location: null,
    image: null,
    cv: null,
    email: null,
    dob: null,
    phone: null,
    experience: null,
    posts: null,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [showContactForm, setShowContactForm] = useState(false);

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const response = await axios.get(
          `${CompanyApi}userProfileView?userId=${userId}`
        );
        setUserDetails(response.data.seekerData);
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, [userId]);

  return (
    <div>
      {showContactForm ? (
        <div className="mr-96 flex justify-start items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
          <div
            id="profile"
            className="max-w-4xl lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-0 lg:mx-6 relative"
          >
            <div class="px-4 md:p-12 text-center lg:text-left">
              <div class="lg:block rounded-full shadow-xl mx-auto w-48 bg-cover bg-center">
                <img
                  src={userDetails.image}
                  class="lg:block rounded-full shadow-xl mx-auto h-48 w-48 bg-cover bg-center"
                />
              </div>

              <h1 class="text-3xl font-bold pt-8 lg:pt-0">
                {userDetails.username}
              </h1>
              <div class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-pink-500 opacity-25"></div>
              <p class="pt-4 text-base font-semibold flex items-center justify-center lg:justify-start">
                <FaBriefcase className="fill-current text-pink-500 mr-4" />
                {userDetails.headline}
              </p>
              <p class="pt-4  text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                <FaEnvelope className="fill-current text-pink-500 mr-4" />
                {userDetails.email}
              </p>
              <p class="pt-4  text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                <FaPhone className="fill-current text-pink-500 mr-4" />
                {userDetails.phone}
              </p>
              {userDetails.location && userDetails.location.length > 0 ? (
                userDetails.location.map((location, index) => (
                  <p
                    key={index}
                    class="pt-4 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start"
                  >
                    <FaMapMarker className="fill-current text-pink-500 mr-4" />
                    {location.city}, {location.state}, {location.district}
                  </p>
                ))
              ) : (
                <p class="pt-4 text-gray-600 text-xs lg:text-sm">
                  No location available
                </p>
              )}

              <p class="pt-8 text-sm">{userDetails.about}</p>

              <div className="pt-12 pb-8 w-full">
                <button
                  className="bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full"
                  onClick={toggleContactForm}
                >
                  Go back!
                </button>
              </div>

              <div class="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                <a class="link" href="#" data-tippy-content="@facebook_handle">
                  <FaFacebook />
                </a>
                <a class="link" href="#" data-tippy-content="@twitter_handle">
                  <FaTwitter />
                </a>
                <a class="link" href="#" data-tippy-content="@github_handle">
                  <IoLogoGithub />
                </a>
                <a class="link" href="#" data-tippy-content="@instagram_handle">
                  <FaInstagram />
                </a>
                <a class="link" href="#" data-tippy-content="@youtube_handle">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {showContactForm && (
              <div className="bg-pink-50 p-4 rounded absolute right-0 left-0 bottom-0 top-0 transform translate-x-full transition-transform ease-in-out duration-300 w-[700px]">
                {userDetails.posts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                    {userDetails.posts.map((post, index) => (
                      <div key={post._id} className="mb-2 hover:scale-105">
                        <Link to={`/single-picView?imageId=${post._id}`}>
                          <img src={post.picture} alt={`image ${index + 1}`} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white w-full h-72 sm:h-96 flex flex-col justify-center items-center">
                    <div>
                      <p className="text-black">No posts available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl flex justify-center items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
          <div
            id="profile"
            className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-0 lg:mx-6 relative"
          >
            <div class="px-4 md:p-12 text-center lg:text-left">
              <div class="lg:block rounded-full shadow-xl mx-auto w-48 bg-cover bg-center">
                <img
                  src={userDetails.image}
                  class="lg:block rounded-full shadow-xl mx-auto h-48 w-48 bg-cover bg-center"
                />
              </div>

              <h1 class="text-3xl font-bold pt-8 lg:pt-0">
                {userDetails.username}
              </h1>
              <div class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-pink-500 opacity-25"></div>
              <p class="pt-4 text-base font-semibold flex items-center justify-center lg:justify-start">
                <FaBriefcase className="fill-current text-pink-500 mr-4" />
                {userDetails.headline}
              </p>
              <p class="pt-4  text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                <FaEnvelope className="fill-current text-pink-500 mr-4" />
                {userDetails.email}
              </p>
              <p class="pt-4  text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                <FaPhone className="fill-current text-pink-500 mr-4" />
                {userDetails.phone}
              </p>
              {userDetails.location && userDetails.location.length > 0 ? (
                userDetails.location.map((location, index) => (
                  <p
                    key={index}
                    class="pt-4 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start"
                  >
                    <FaMapMarker className="fill-current text-pink-500 mr-4" />
                    {location.city}, {location.state}, {location.district}
                  </p>
                ))
              ) : (
                <p class="pt-4 text-gray-600 text-xs lg:text-sm">
                  No location available
                </p>
              )}

              <p class="pt-8 text-sm">{userDetails.about}</p>

              <div className="pt-12 pb-8 w-full">
                <button
                  className="bg-pink-400 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full"
                  onClick={toggleContactForm}
                >
                  Show posts
                </button>
              </div>

              <div class="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                <a class="link" href="#" data-tippy-content="@facebook_handle">
                  <FaFacebook />
                </a>
                <a class="link" href="#" data-tippy-content="@twitter_handle">
                  <FaTwitter />
                </a>
                <a class="link" href="#" data-tippy-content="@github_handle">
                  <IoLogoGithub />
                </a>
                <a class="link" href="#" data-tippy-content="@instagram_handle">
                  <FaInstagram />
                </a>
                <a class="link" href="#" data-tippy-content="@youtube_handle">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherUser;
