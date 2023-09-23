import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserApi } from "../../configs/api";
import Axios from "axios";
import { seekerDetails } from "../../Store/storeSlices/seekerAuth";
import { FaPhone,FaEnvelope,FaCalendar,FaMapMarker } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const navigate = useNavigate();
 
  const [userDetails, setUserDetails] = useState({
    username: null,
    headline: null,
    about: null,
    skills: null,
    location: null,
    image: null,
    cv:null,
    email: null,
    dob: null,
    phone: null,
    experience:null
  });

  const rawDate = userDetails.dob;
  console.log(userDetails, "this is the object");
  let formattedDate = null;
  const dateObj = new Date(rawDate);
  formattedDate = dateObj.toLocaleDateString();


    const data = useSelector((state) => {
        return state?.seekerDetails.seekerToken;
      });

    
  const handleEditProfile = async() => {
    try {
        navigate("/edit-myProfile",{ state: { userDetails } })
    } catch (error) {
        console.log(error);
    }
  };


  useEffect(() => {
    const handleProfile = async () => {
      try {
        console.log("entering to the axios profile");
        const response = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(data)}`
        ).then((res) => {
          let seekerData = res.data.seekerData;
          setUserDetails(seekerData);
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleProfile();
  }, []);


  return (
    <section className="h-[calc(100vh+30rem)] bg-pink-50">
      <div className="container py-5 h-screen">
        <div className="flex justify-center h-screen">
          <div className="lg:w-9/12 xl:w-7/12 bg-white">
            <div className="bg-white rounded-t text-black flex flex-row">
              <div
                className="ms-4 mt-5 flex flex-col items-center"
                style={{ width: "150px" }}
              >
                {userDetails.image ? (
                  <img
                    src={userDetails.image}
                    alt="User Profile"
                    className="img-fluid img-thumbnail mt-4 mb-16 w-24 h-24 rounded-full"
                  />
                ) : (
                  <img
                    src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                    alt="Generic placeholder image"
                    className="img-fluid img-thumbnail mt-4 mb-16 w-32 h-32 rounded-full"
                  />
                )}
              </div>
              <div
                className="ms-3 flex flex-col"
                style={{ marginTop: "110px" }}
              >
                <h5>{userDetails.username}</h5>
                <p>{userDetails.headline}</p>
                <p>{userDetails.email}</p>
              </div>
            </div>
            <div
              className="p-4 text-black"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="flex justify-between text-center py-1">
                <div className="flex w-50 justify-center h-11">
                  <button
                    onClick={handleEditProfile}
                    className="p-1 w-36 h-10 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500"
                  >
                    Edit profile
                  </button>
                </div>
                <div className="flex inline-block">
                {userDetails.skills && userDetails.skills.length > 0 && (
                  <div>
                    <p className="mb-1 text-lg">{userDetails.skills.length} </p>
                    <p className="text-xs text-muted mb-0">Skills</p>
                  </div>
                   )}

                  <div className="pl-2">
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">Jobs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-4 text-black">
              <div className="mb-5">
                {userDetails.about ? (
                  <div>
                    <p className="text-xl font-normal mb-1">About</p>
                    <div className="p-4 " style={{ backgroundColor: "#f8f9fa" }}>
                      <textarea disabled className="italic h-20 w-5/6 mb-1">{userDetails.about}</textarea>
                    </div>
                  </div>
                ) : (
                  <div hidden></div>
                )}
                {userDetails.cv ? (
                  <div>
                    <p className="text-xl font-normal mb-1">Your CV</p>
                    <div className="p-4 " style={{ backgroundColor: "#f8f9fa" }}>
      
                    <button
                    onClick={() => window.open(userDetails.cv, '_blank')}
                    className="px-4 py-2 mt-3 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300"
                  >
                    View CV
                  </button>
                    </div>
                  </div>
                ) : (
                  <div hidden></div>
                )}

                {userDetails.experience ? (
                  <div>
                    <p className="text-xl font-normal mb-1">Experience</p>
                    <div className="p-4 " style={{ backgroundColor: "#f8f9fa" }}>
                      <textarea disabled className="italic h-20 w-5/6 mb-1">{userDetails.experience}</textarea>
                    </div>
                  </div>
                ) : (
                  <div hidden></div>
                )}


                {userDetails.skills && userDetails.skills.length > 0 && (
                  <div>
                    <p className="text-xl font-normal mb-1 font-bold">Skills</p>
                    <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                      <p className="italic mb-1">
                        {userDetails.skills.map((skill,i) => (
                          <>
                          {skill}
                          {userDetails.skills.length-1 === i ? "":", "}
                          </>
                        ))}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xl font-normal m-5">Personal details</p>
                <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                {userDetails.phone ? (
                  <p className="font-mono mb-1 flex items-center">
                    <span className="w-8">
                      <FaPhone />
                    </span>
                    {userDetails.phone}
                  </p>
                ) : (
                  <div hidden></div>
                )}

                  <p className="font-mono mb-1 flex items-center">
                    <span className="w-8"><FaEnvelope /></span>
                    {userDetails.email}
                  </p>
                  <p className="font-mono mb-1 flex items-center">
                    <span className="w-8"><FaCalendar/></span>{" "}
                    {formattedDate}
                  </p>
                  {userDetails.location && userDetails.location.length > 0 && (
                    <div className="flex display-inline">
                      {userDetails.location.map((location, index) => (
                        <div key={index} className="italic">
                          <p className="font-mono mb-1 flex items-center">
                            <span className="w-8"><FaMapMarker/></span>{" "}
                            {location.city}, {location.state}, {location.district}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <button
                    className={`p-1 w-20 border rounded-full shadow-md ${
                      activeTab === "jobs" ? "bg-pink-400" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveTab("jobs")}
                  >
                    Jobs
                  </button>
                  <button
                    className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                      activeTab === "events" ? "bg-pink-400" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Events
                  </button>
                </div>
                <p className="mb-0">
                  <a
                    href="#!"
                    className="p-1 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500"
                  >
                    Show all
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white">
                <h1 className="text-4xl flex justify-center items-center">
                  Jobs applied
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
