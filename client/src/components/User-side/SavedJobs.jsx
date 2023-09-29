import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserApi } from "../../configs/api";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaTrash,
  FaGraduationCap,
  FaBuilding,
  FaMoneyBillAlt,
  FaClock,
  FaMapMarker,
} from "react-icons/fa";

const SavedJobs = () => {
  const [jobData, setJobData] = useState([]);

  const navigate = useNavigate();

  const seeker = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${UserApi}savedJobs?data=${encodeURIComponent(seeker)}`
        );
        const jobData = response.data.jobData;
        setJobData(jobData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchData();
  }, []);

  const handleHomeView = () => {
    navigate('/home');
  };

  const handleJobView = () => {
    navigate('/jobView');
  };

  return (
    <div className="bg-gray-100 h-screen w-full flex flex-wrap justify-between p-5">
      <div className="mt-5 w-8/12">
        <h2 className="text-lg font-bold mb-2 text-center">Saved jobs</h2>

        <div className="bg-white rounded p-4 shadow-md">
          <h4 className="font-bold">Saved ({jobData.length} jobs)</h4>
          {jobData.length !== 0 ? (
            jobData.map((val) => (
              <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden ">
                <div className="mt-2 store-item pb-3 bg-pink-50">
                  <div className="flex gap-3">
                    <div className="w-3/4 p-4">
                      <div className="flex justify-between items-center">
                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaBriefcase />
                        </span>
                        <h4 className="font-semibold">
                          {val.position}
                        </h4>
                      </div>
                        
                        <div className="flex justify-end">
                          <button>
                            <span>
                              {" "}
                              <FaTrash />
                            </span>
                          </button>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaGraduationCap />
                        </span>
                        <p>
                          {val.skills.map((skill, i) => (
                            <>
                              {skill}
                              {val.skills.length - 1 === i ? "" : ", "}
                            </>
                          ))}
                        </p>
                      </div>

                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaMoneyBillAlt />
                        </span>
                        <p>{val.salary}</p>
                      </div>

                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaClock />
                        </span>
                        <p>{val.time}</p>
                      </div>
                      <div class="flex items-center">
                        <span class="w-8 font-bold">
                          <FaBuilding />
                        </span>
                        <p>{val.company.company}</p>
                      </div>

                      {val.company.address.map((value) => (
                        <div class="flex items-center">
                          <span class="w-8 font-bold">
                            <FaMapMarker />
                          </span>
                          <p>
                            {value.building}, {value.city}, {value.district},{" "}
                            {value.state}, {value.pin}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div hidden></div>
          )}
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="bg-white rounded p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h4>The total amount saved jobs :</h4>
            <p className="pl-2">{jobData.length}</p>
          </div>
          <div className="mt-2">
            <button onClick={handleHomeView} className="w-full bg-pink-500 rounded px-3 py-2 text-white">
              Go To Home
            </button>
          </div>
        </div>
        <div className="bg-white rounded p-4 shadow-md">
          <div className="flex justify-between items-center">
            <p>
              Apply job now!{" "}
              <button onClick={handleJobView} className="w-20 ml-3 bg-pink-500 rounded  text-white">
                Job list
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
