import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AdminApi } from '../../configs/api';
import { Button, Modal } from 'antd';
import {toast} from 'react-hot-toast';


const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [access, setAccess] = useState(true);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);


  useEffect(() => {
    axios.get(`${AdminApi}companyManagement`).then((res) => {
      setCompanies(res.data.companyData);
    });
  }, [access]);

  const handleBlockCompany = async (data) =>{
    axios.post(`${AdminApi}blockCompany`,{data:data}).then((res) => {
      if(res.data.success){       
        toast.success(res.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#B00043',
            color: '#fff',
          },
        });
        if(access===true){
          setAccess(false)
         }else{
          setAccess(true)
         }
      }
    });
  }
  
  const handleUnBlockCompany = async (data) =>{
    axios.post(`${AdminApi}unblockCompany`,{data:data}).then((res) => {
      if(res.data.success){
        toast.success(res.data.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#B00043',
            color: '#fff',
          },
        });
         if(access===true){
            setAccess(false)
           }else{
            setAccess(true)
           }
      }else{
        toast.error("something went wrong !")
      }
    });
  }

  return (
    <section className="h-full overflow-scroll">
      <h1 className="flex justify-center pb-5 text-3xl">Company Management</h1>
      <table className="w-11/12 ml-8 min-w-max table-auto text-left bg-pink-50">
        <thead>
          <tr>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Company ID
                </span>
              </th>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Company
                </span>
              </th>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Email
                </span>
              </th>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 pl-10 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Action
                </span>
              </th>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 pl-10 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Jobs list
                </span>
              </th>
              <th
                className="border-b border-blue-gray-100 bg-blue-gray-50 pl-10 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Detailes
                </span>
              </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{company._id}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{company.company}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{company.email}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
              {company.access===true ? (
                  <button
                    onClick={() => handleUnBlockCompany(company._id)}
                    className="p-1 w-20 ml-5 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockCompany(company._id)}
                    className="p-1 w-20 ml-5 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
                  >
                    Block
                  </button>
                )}
              </td>
              <td className="p-4 border-b border-blue-gray-50">
              <Button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 
                shadow-md hover:bg-pink-400" type="pink"  onClick={()=>{setIsJobsModalOpen(true);}}>
                View
              </Button>
                <Modal title="List of Jobs" open={isJobsModalOpen} footer={null} onCancel={()=>{setIsJobsModalOpen(false);}}>
                {company.jobs.map((val,i) => (
                          <>
                          <p>{i+1+". "+val}</p>
                          </>
                        ))}
                </Modal>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
              <Button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 
                shadow-md hover:bg-pink-400" type="pink" onClick={()=>{setIsModalOpen(true)
                }}>
                Details
              </Button>
              </td>
             
              <Modal title="Other details" open={isModalOpen}  onCancel={()=>{setIsModalOpen(false)}}>
                    <p>Started date : {company.startedDate}</p>
                    <p>Headline : {company.headline}</p>
                    {company.address.map((val) => (
                      <div key={val._id}>
                        <p>Location: {val.building}, {val.city}, {val.district}, {val.state}, {val.pin}(pin)</p>
                        <p>Contact No: {val.phone}</p>
                      </div>
                    ))}

              </Modal>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Companies;
