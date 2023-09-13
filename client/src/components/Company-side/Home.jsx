import React,{useState,useEffect} from 'react';
import { CompanyApi } from '../../APIs/api';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const Home = () => {

  const [jobList, setJobList] = useState([]);

  const company = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        await Axios.get(`${CompanyApi}JobDetails?data=${encodeURIComponent(company)}`).then((res) => {
          let companyData = res.data.companyData;
          const data = companyData.jobs;
          setJobList(data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleJobDetails();
  }, []);

  return (
    <div className='w-full h-screen bg-white flex justify-center '>
      <div className="flex flex-wrap">
        <div className=' sm:w-1/4 lg:w-3/12'>
            <div className='bg-black w-10'>

            </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-5/12 p-4 mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold">Recommended for you</h2>
          <ul className="mt-2 flex flex-wrap h-[500px] overflow-y-auto ">
            {jobList.map((val, i) => (
              <li className="w-full " key={i}>
                <div className="box mb-4 p-4 text-center shadow-md">
                  <div className="bg-pink-50 h-32 mb-2">
                    <div>
                      <h4>Requirements</h4>
                      <p>{val.requirements}</p>
                    </div>
                    <div>
                      <h4>Description</h4>
                      <p>{val.description}</p>
                    </div>
                  </div>
                  <h3 className="title text-lg font-semibold">{val.position}</h3>
                  <p className="price text-xl font-semibold">{val.salary}</p>
                  <p className="price text-xl font-semibold">{val.time}</p>
                  <button
                    className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
