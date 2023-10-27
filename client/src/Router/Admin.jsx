import React,{Fragment,useEffect} from 'react';
import {Route,Routes} from 'react-router-dom';
import SignIn from '../components/Admin-side/SignIn';
import Dashboard from '../Pages/Admin/Dashboard';
import {ErrorBoundary} from 'react-error-boundary';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import { adminDetails } from '../Store/storeSlices/adminAuth';


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

const Admin = () => {

  const dispatch = useDispatch()
  const storedInfo = localStorage.getItem('adminInformation')

  useEffect(() => {
    if(storedInfo){
      const info = JSON.parse(storedInfo)
      if(info.role == "admin"){
        dispatch(adminDetails(info))
      }
    }else{
      console.log("No data found in local storage");
    }

  }, []);

  const admin = useSelector((state)=>{
    return state.adminDetails.adminToken
  })


  
  return (
    <Fragment>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
          
        <Routes>

          <Route path='/admin-login' element={!admin ? <SignIn/>: <Dashboard/>}/>

          <Route path='/dashboard' element={admin ? <Dashboard/> : <SignIn/>}/>

        </Routes>

      </ErrorBoundary>
    </Fragment>
  );
}

export default Admin;
