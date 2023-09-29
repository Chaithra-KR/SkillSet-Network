import React,{Fragment,useEffect} from 'react';
import {Route,Routes} from 'react-router-dom';
import CompanyAccess from '../components/Company-side/CompanyAccess';
import CompanyProfile from '../Pages/Company/CompanyProfile';
import EditCompanyProfile from '../Pages/Company/EditCompanyProfile';
import CentralHub from '../Pages/Company/CentralHub';
import CompanyOTP from '../Pages/Company/CompanyOTP';
import CompanyPremium from '../components/Company-side/CompanyPremium';
import {ErrorBoundary} from 'react-error-boundary';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import { companyDetails } from '../Store/storeSlices/companyAuth';
import JobScheduling from '../Pages/Company/JobScheduling';
import Notification from '../Pages/Company/Notification';
import UserProfileView from '../Pages/Company/UserProfileView';
import SinglePostView from '../Pages/Company/SinglePostView';

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

const Company = () => {

  const dispatch = useDispatch()
  const storedInfo = localStorage.getItem('companyInformation')

  useEffect(() => {
    if(storedInfo){
      const info = JSON.parse(storedInfo)
      if(info.role == "company"){
        dispatch(companyDetails(info))
      }
    }else{
      console.log("No data found in local storage");
    }

  }, []);

  const company = useSelector((state)=>{
    return state.companyDetails.companyToken
  })


  
  return (
    <Fragment>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>

            <Route path='/company-login' element={!company ?<CompanyAccess/> : <CentralHub/>}/>

            <Route path='/company-signUp' element={!company ? <CompanyAccess/> : <CentralHub/>}/>

            <Route path='/company-otp' element={!company ? <CompanyOTP/> : <CentralHub/>}/>

            <Route path='/company-premium' element={!company ? <CompanyPremium/> : <CentralHub/>}/>

            <Route path='/central-hub' element={company ? <CentralHub/> : <CompanyAccess/>}/>

            <Route path='/company-profile' element={company ? <CompanyProfile/> : <CompanyAccess/>}/>

            <Route path='/company-editProfile' element={company ? <EditCompanyProfile/> : <CompanyAccess/>}/>

            <Route path='/company-Jobs' element={company ? <JobScheduling/> : <CompanyAccess/>}/>

            <Route path='/notifications' element={company ? <Notification/> : <CompanyAccess/>}/>

            <Route path='/view-userProfile' element={company ? <UserProfileView/> : <CompanyAccess/>}/>

            <Route path='/singlePost' element={company ? <SinglePostView/> : <CompanyAccess/>}/>  

        </Routes>
      </ErrorBoundary>
    </Fragment>
  );
}

export default Company;
