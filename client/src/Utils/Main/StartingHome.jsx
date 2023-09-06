import React,{Fragment} from 'react';
import {useNavigate} from 'react-router-dom';
import Footer from '../../components/User-side/Footer';
import LandingNav from '../../components/User-side/LandingNav';

const StartingHome = () => {
  const navigate = useNavigate()

  const handleSeekOrCompany = () =>{
    navigate('/seek-Or-com')
  }

  return (
    <Fragment>
      <LandingNav/>
      <div className="h-96 w-full flex">
        <div className="w-6/12 bg-pink-50 pt-10">
            <p className='text-pink-500 pl-5' style={{fontSize:"75px",fontFamily:"sans-serif",fontWeight:"bold"}}>Connecting Careers: </p>
            <div className='pl-28'>
            <p className='font-bold pb-8'>Where Companies and Talent Unite – Your Path to Professional Success Starts Right Here, Right Now!.</p>
            <div className='pl-52'>
            <button onClick={handleSeekOrCompany} className="p-1 w-32 h-11 ml-5 border border-transparent  text-white rounded-full bg-pink-500 shadow-md hover:bg-pink-400">Get Started</button>  
            </div>
            </div>
        </div>
        <div className="w-6/12 bg-pink-50 flex justify-center items-center">
            <img className='w-auto h-72' src="https://i.pinimg.com/564x/f6/1b/89/f61b89fa72f96a048834c4b40639e7e9.jpg" alt="trust hand" />
        </div>
      </div>
      <div className="h-96 w-full flex bg-pink-400">
        <h1 style={{fontSize:"75px",fontFamily:"sans-serif",fontWeight:"bold"}}>path to register</h1>
      </div>
      <Footer/>
    </Fragment>
  );
}

export default StartingHome;
