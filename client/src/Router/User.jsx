import React,{Fragment, useEffect} from 'react';
import {Route,Routes} from 'react-router-dom';
import StartingHome from '../Pages/Main/StartingHome';
import SeekerOrCompany from '../Pages/Main/SeekerOrCompany';
import UserProfile from '../Pages/User/UserProfile';
import EditUserProfile from '../Pages/User/EditUserProfile';
import UserAccess from '../components/User-side/UserAccess';
import OTP from '../Pages/User/OTP';
import UserHome from '../Pages/User/UserHome';
import {ErrorBoundary} from 'react-error-boundary';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import { seekerDetails } from '../Store/storeSlices/seekerAuth';
import Jobs from '../Pages/User/Jobs';
import Saved from '../Pages/User/Saved';
import JobApplyNow from '../Pages/User/JobApplyNow';
import ResetPassword from '../Pages/User/ResetPassword';
import ChatWithCompany from '../Pages/User/ChatWithCompany';


function ErrorFallback({error, resetErrorBoundary}) {
  return(
    <div>
      <h2 className='text-black'>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

ErrorFallback.propTypes = {
  error: propTypes.object.isRequired,
  resetErrorBoundary: propTypes.func.isRequired
}

const User = () => {

    const dispatch = useDispatch()
    const storedInfo = localStorage.getItem('userInformation')

    useEffect(() => {
      if(storedInfo){
        const info = JSON.parse(storedInfo)
        if(info.role == "seeker"){
          dispatch(seekerDetails(info))
        }
      }else{
        console.log("No data found in local storage");
      }

    }, []);

    const seeker = useSelector((state)=>{
      return state?.seekerDetails.seekerToken
    })  
    

  return (
    <Fragment>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
            <Route path='/' element={!seeker ? <StartingHome/>: <UserHome/>}/>

            <Route path='/seek-Or-com' element={!seeker ?<SeekerOrCompany/> : <UserHome/>}/>

            <Route path='/Otp' element={!seeker ? <OTP/> : <UserHome/> }/>

            <Route path='/login' element={!seeker ? <UserAccess/> :<UserHome/> }/>

            <Route path='/signUp' element={!seeker ? <UserAccess/> :<UserHome/> }/>

            <Route path='/home' element={seeker ? <UserHome/> : <UserAccess/>}/>

            <Route path='/my-profile' element={seeker ? <UserProfile/> : <UserAccess/>}/>

            <Route path='/edit-myProfile' element={seeker ? <EditUserProfile/> : <UserAccess/>}/>

            <Route path='/jobView' element={seeker ? <Jobs/> : <UserAccess/>}/>

            <Route path='/saved-jobs' element={seeker ? <Saved/> : <UserAccess/>}/>

            <Route path='/apply-job' element={seeker ? <JobApplyNow/> : <UserAccess/>}/>
          
            <Route path='/change-password' element={seeker ? <ResetPassword/> : <UserAccess/>}/>

            <Route path='/chat-with-company' element={seeker ? <ChatWithCompany/> : <UserAccess/>}/>
           
        </Routes>
      </ErrorBoundary>
    </Fragment>
  );  
}

export default User;
