import React,{useState,useEffect} from 'react';
import { CompanyApi } from '../../configs/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { companyAxiosInstance } from '../../configs/axios/axios';


const Home = () => {

  const [companyDetails, setCompanyDetails] = useState({
    company: null,
    email: null,
    headline: null,
    image: null,
    peoples: null,
  });

  const [matchedUsers, setMatchedUsers] = useState([])

  const company = useSelector((state) => {
    return state?.companyDetails.companyToken;
  });

  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        await companyAxiosInstance.get(`${CompanyApi}companyProfile?data=${encodeURIComponent(company)}`).then((res) => {
          let data = res.data.companyData;
          let userData = res.data.matchedUsers
          setCompanyDetails(data);
          setMatchedUsers(userData)
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleJobDetails();
  }, []);

  const navigate = useNavigate()

  const handleJobView = () =>{
    navigate('/company/company-Jobs')
  }
  
  const handleProfileAccess = () =>{
    navigate('/company/company-profile')
  }

  const handleEditProfileAccess = () =>{
    navigate('/company/company-editProfile')
  }

  return (
    <div className='w-full h-screen bg-white '>
      <div className="flex flex-wrap">
        <div className=' w-96 flex justify-center'> 
          <div className='bg-pink-100 w-72 m-5 h-4/6 rounded'>
                  
                   {companyDetails.image ? (
                  <img
                    src={companyDetails.image}
                    alt="User Profile"
                    className="img-fluid img-thumbnail mt-9 ml-16 w-28 h-28 rounded-full"
                  />
                ) : (
                  <img
                    src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                    alt="Generic placeholder image"
                    className="img-fluid img-thumbnail mt-9 ml-16 w-28 h-28 rounded-full"
                  />
                )}
                <div className='h-3/6 m-7 '>
                    <div className='pl-16'>
                      <h1 >{companyDetails.username}</h1>
                      <h1 >{companyDetails.headline}</h1>
                    </div>
                    <div className='pl-10 mt-3'>
                      <button onClick={handleProfileAccess} className='bg-pink-600 rounded w-28 mb-12 p-1'>View profile</button>
                      <button onClick={handleEditProfileAccess} className='bg-pink-600 rounded w-28 mb-4 p-1'>Edit profile</button>
                      <button onClick={handleJobView} className='bg-pink-600 rounded w-28 p-1'>Jobs</button>
                    </div>
                </div>
          </div>
        </div>
        <div className="p-4 mb-4 md:mb-0">
          <button onClick={handleJobView} className=' w-[600px] bg-pink-100 border border-pink-200  hover:bg-pink-500 shadow-md h-14 mb-2 rounded'>New Job</button>
          <div className='bg-gray-100 w-[600px] rounded p-5'>
          <h2 className="text-lg font-semibold">Recommended candidates for you!</h2>
          <ul className="mt-2 flex flex-wrap h-[500px] overflow-y-auto ">
          {matchedUsers.map((val, i) => (
              <li className="w-full md:w-1/2" key={i}>
                <div className="box mb-4 p-4 text-center shadow-md">
                  <div className="bg-pink-50 h-32 mb-2">
                    <div>
                    <h3 className='font-bold'>Skills</h3>
                    <p className='text-sm'>{val.skills.map((skill,i) => (
                          <>
                          {skill}
                          {val.skills.length-1 === i ? "":", "}
                          </>
                        ))}</p>
                    </div>
                  </div>
                  <h3 className="title text-lg font-semibold">{val.username}</h3>
                  <p className="price text-xl font-semibold">{val.email}</p>
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
        <div className='bg-pink-50 w-96 ml-12 mt-4 rounded-md'>
          <p className='text-center font-bold'>Recent posts</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
