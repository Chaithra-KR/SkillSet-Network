import React,{Fragment} from 'react';
import {Route,Routes} from 'react-router-dom';
import CompanyAccess from '../components/Company-side/CompanyAccess';
import CompanyProfile from '../Utils/Company/CompanyProfile';
import EditCompanyProfile from '../Utils/Company/EditCompanyProfile';
import CentralHub from '../Utils/Company/CentralHub';
import StartingHome from '../Utils/Main/StartingHome';


const Company = () => {
  return (
    <Fragment>
        <Routes>
            <Route path='/company-login' element={<CompanyAccess/>}/>

            <Route path='/company-signUp' element={<CompanyAccess/>}/>

            <Route path='/central-hub' element={<CentralHub/>}/>

            <Route path='/company-profile' element={<CompanyProfile/>}/>

            <Route path='/company-editProfile' element={<EditCompanyProfile/>}/>

            <Route path='/company-logout' element={<StartingHome/>}/>


        </Routes>
        
    </Fragment>
  );
}

export default Company;
