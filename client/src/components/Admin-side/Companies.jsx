import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AdminApi } from '../../APIs/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get(`${AdminApi}companyManagement`).then((res) => {
      setCompanies(res.data.companyData);
    });
  }, []);

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
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <span className="font-normal leading-none opacity-70">
                  Action
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
                <button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 
                shadow-md hover:bg-pink-400">Block</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Companies;
