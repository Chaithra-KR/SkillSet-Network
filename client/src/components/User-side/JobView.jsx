import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserApi } from '../../configs/api';
import { Button, Modal } from 'antd';
import { FaPhone,FaEnvelope,FaMoneyBillAlt,FaClock,FaMapMarker } from 'react-icons/fa';
import { useSelector } from 'react-redux';


const JobView = () => {
  const [jobs, setJobs] = useState([]); 
  const [jobPosition, setJobPosition] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([])

  const seeker = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${UserApi}jobView?data=${encodeURIComponent(seeker)}`);
        let matchedJobs = response.data.matchedJobs;
        setMatchedJobs(matchedJobs)
        const jobData = response.data.jobs;
        setJobs(jobData);
        setFilteredJobs(jobData);
        let jobPosition = response.data.jobPosition;
        setJobPosition(jobPosition)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();    
  }, []);

  const handleSearch = () => {
    const regex = new RegExp(searchQuery, 'i');
    const filtered = searchQuery
      ? jobs.filter((job) => regex.test(job.position) || regex.test(job.company.company))
      : jobs;

    setFilteredJobs(filtered);
  };

  const openModal = (job) => {
    setSelectedJob(job);
  };
  
  
  const closeModal = () => {
    setSelectedJob(null); 
  };

  return (
    <div className="w-full bg-white">
      <div className=" flex flex-wrap  justify-between mt-4 mb-4">
        <div>
        <input
          type="text"
          placeholder="Search by position or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 sm:w-72 md:w-96 focus:outline-none focus:border-pink-300"
        />
        <button
          onClick={handleSearch}
          className="bg-pink-500 text-white px-4 py-2 ml-2 rounded-lg"
        >
          Search
        </button>
        </div>
        <div>
        <label htmlFor="jobFilter">Filter by Job: </label>
        <select id="jobFilter" className="border rounded-lg px-4 py-2 w-64 sm:w-25 md:w-50 focus:outline-none focus:border-pink-300" value={selectedJob} >
          <option value="">Select Job</option>
          {jobPosition.map((job) => (
            <option key={job.id} value={job.title}>
              {job.title}
            </option>
          ))}
        </select>
        </div>
      </div>
      
      {matchedJobs.length > 0 ? (
      <h2 className="ml-10 text-lg font-semibold font-mono">Recommended jobs for you!</h2>
      ):(<div hidden> </div>)}

      <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
      {matchedJobs.map((val, i) => (
              <li className="w-full md:w-1/4" key={i}>
                <div className="box mb-4 p-4 text-center shadow-md">
                  <div className="bg-pink-50 h-32 mb-2">
                    <div>
                      <p className="text-lg font-bold">{val.position}</p>
                    </div>
                    <div>
                      <p className="text-sm">at <scan className='font-bold'> {val.company.company}</scan></p>
                    </div>
                    <div>
                          <p className="font-bold">Required skills :</p>
                          <p className="italic mb-1">
                          {val.skills.map((skill,i) => (
                            <>
                            {skill}
                            {val.skills.length-1 === i ? "":", "}
                            </>
                          ))}
                          </p>
                      </div>
                  </div>

                  <h3 className="title text-lg font-semibold">Rs {val.salary}/-</h3>
                  <Button className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                  type="pink"  onClick={() => openModal(val)}>
                      View
                  </Button>
                  <Modal title="About the vacancy" visible={selectedJob === val}  onCancel={closeModal}>

                      <h1 className='text-xl font-bold pb-3'>{val.position} <scan className='text-sm' >( {val.company.company} )</scan></h1>
                      <div className='mb-3'>
                        <div class="flex items-center">
                          <span class="w-8 font-bold"><FaClock/></span>
                          <p>{val.time}</p>
                        </div>
                      {val.company.address.map((value)=>(
                          <div>
                            <div class="flex items-center">
                              <span class="w-8 font-bold"><FaMapMarker/></span>
                              <p>{value.building}, {value.city}, {value.district}, {value.state}, {value.pin}</p>
                            </div>
                            <div class="flex items-center">
                              <span class="w-8 font-bold"><FaPhone/></span>
                              <p>{value.phone}</p>
                            </div>
                          </div>
                      ))}
                      <div class="flex items-center">
                        <span class="w-8 font-bold"><FaEnvelope/></span>
                        <p>{val.company.email}</p>
                      </div>
                      <div class="flex items-center">
                        <span class="w-8 font-bold"><FaMoneyBillAlt/></span>
                        <p>Rs {val.salary}/-</p>
                      </div>
                      </div>
                      <p><scan className='font-bold'>Required skills : </scan>
                          {val.skills.map((skill,i) => (
                            <>
                            {skill}
                            {val.skills.length-1 === i ? "":", "}
                            </>
                          ))}
                        </p>
                      {/* <p className='text-green-500'>5 of 5 skills match your profile - you may be a good fit</p> */}
                      <div className='mt-3'>
                          <h3 className='font-bold'>Requirements </h3>
                          <p>{val.requirements}</p>
                      </div>
                      <div className='mt-3'>
                          <h3 className='font-bold'>Description </h3>
                          <p>{val.description}</p>
                      </div>
                      <button className="p-1 mt-2 w-16 border border-transparent  text-white rounded-full bg-pink-500 shadow-md hover:bg-pink-400">Apply</button>     
                  </Modal>
                </div>
              </li>
            ))}
          </ul>

      {filteredJobs.length > 0 ? (
      <h2 className="ml-10 text-lg font-bold font-mono">Other jobs!</h2>
      ):(<div hidden> </div>)}

      <ul className="mt-2 flex flex-wrap overflow-y-auto p-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, i) => (
            <li className="w-full md:w-1/4" key={i}>
              <div className="box mb-4 p-4 text-center shadow-md">
                <div className="bg-pink-50 h-32 mb-2">
                  <div>
                    <p className="text-lg font-bold">{job.position}</p>
                  </div>
                  <div>
                    <p className="text-sm">at <scan className='font-bold'> {job.company.company}</scan></p>
                  </div>
                  <div>
                        <p className="font-bold">Required skills :</p>
                        <p className="italic mb-1">
                        {job.skills.map((skill,i) => (
                          <>
                          {skill}
                          {job.skills.length-1 === i ? "":", "}
                          </>
                        ))}
                      </p>
                    </div>
                </div>
                <h3 className="title text-lg font-semibold">Rs {job.salary}/-</h3>
                <Button className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                 type="pink"  onClick={() => openModal(job)}>
                    View
                </Button>
                <Modal title="About the vacancy" visible={selectedJob === job}  onCancel={closeModal}>

                    <h1 className='text-xl font-bold pb-3'>{job.position} <scan className='text-sm' >( {job.company.company} )</scan></h1>
                    <div className='mb-3'>
                      <div class="flex items-center">
                        <span class="w-8 font-bold"><FaClock/></span>
                        <p>{job.time}</p>
                      </div>
                    {job.company.address.map((val)=>(
                        <div>
                          <div class="flex items-center">
                            <span class="w-8 font-bold"><FaMapMarker/></span>
                            <p>{val.building}, {val.city}, {val.district}, {val.state}, {val.pin}</p>
                          </div>
                          <div class="flex items-center">
                            <span class="w-8 font-bold"><FaPhone/></span>
                            <p>{val.phone}</p>
                          </div>
                        </div>
                    ))}
                    <div class="flex items-center">
                      <span class="w-8 font-bold"><FaEnvelope/></span>
                      <p>{job.company.email}</p>
                    </div>
                    <div class="flex items-center">
                      <span class="w-8 font-bold"><FaMoneyBillAlt/></span>
                      <p>Rs {job.salary}/-</p>
                    </div>
                    </div>
                    <p><scan className='font-bold'>Required skills : </scan>
                        {job.skills.map((skill,i) => (
                          <>
                          {skill}
                          {job.skills.length-1 === i ? "":", "}
                          </>
                        ))}
                      </p>
                    {/* <p className='text-green-500'>5 of 5 skills match your profile - you may be a good fit</p> */}
                    <div className='mt-3'>
                        <h3 className='font-bold'>Requirements </h3>
                        <p>{job.requirements}</p>
                    </div>
                    <div className='mt-3'>
                        <h3 className='font-bold'>Description </h3>
                        <p>{job.description}</p>
                    </div>
                    <button className="p-1 mt-2 w-16 border border-transparent  text-white rounded-full bg-pink-500 shadow-md hover:bg-pink-400">Apply</button>     
                </Modal>
              </div>
              </li>
          ))
        ) : (
            <div className="flex justify-center items-center h-32">
                <scan>No jobs available.</scan>
            </div>
        )}
      </ul>
    </div>
  );
};

export default JobView;