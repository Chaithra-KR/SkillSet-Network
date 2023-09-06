import React,{Fragment} from 'react';
import Navbar from '../../components/Admin-side/Navbar';
import Companies from '../../components/Admin-side/Companies';
import Sidebar from '../../components/Admin-side/Sidebar';


const CompanyManagement = () => {
    return (
        <Fragment>
        <Navbar/>
        <div className="w-full h-screen bg-white text-black font-roboto">
          <div className="flex h-screen rounded border w-full border-gray-50 p-4">
            <div className="w-2/12 bg-white p-4 text-white text-xl">
              <Sidebar/>
            </div>
            <div className="w-10/12 border-1 border-solid text-black relative">
              <Companies/>
            </div>
          </div>
        </div>
      </Fragment>
      );
}

export default CompanyManagement;
