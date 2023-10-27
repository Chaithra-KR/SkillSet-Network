import axios from "axios";
import React, { useEffect, useState } from "react";
import { AdminApi } from "../../configs/api";
import { useSelector } from "react-redux";

const AccountsManage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const admin = useSelector((state) => {
    return state.adminDetails.adminToken;
  });

  useEffect(() => {
    const showJobManagement = async () => {
      try {
        axios
          .get(`${AdminApi}accounts?data=${encodeURIComponent(admin)}`)
          .then((res) => {
            setAccounts(res.data.accounts);
          });
      } catch (error) {
        console.log(error);
      }
    };
    showJobManagement();
  }, [admin]);

  const filteredAccounts = accounts.filter((account) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      account._id.includes(lowerCaseQuery) ||
      (account.user
        ? account.user.name.toLowerCase().includes(lowerCaseQuery)
        : false) ||
      (account.company
        ? account.company.company.toLowerCase().includes(lowerCaseQuery)
        : false)
    );
  });

  return (
    <section className="h-full overflow-scroll">
      <h1 className="flex justify-center pb-5 text-3xl">Accounts Management</h1>
      <div className="flex justify-start ml-10 mb-4 ">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-pink-300 rounded-md p-2"
        />
      </div>
      {filteredAccounts.length > 0 ? (
        <table className="w-11/12 ml-8 min-w-max table-auto text-left bg-pink-50">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">
                  SI No:
                </span>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">
                  Premium Account ID
                </span>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">Name</span>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">
                  Headline
                </span>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">Email</span>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <span className="font-bold leading-none opacity-70">
                  Amount
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((val, i) => (
              <tr key={val._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{i + 1}</span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{val._id}</span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">
                    {val.user ? val.user.username : val.company.company}
                  </span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">
                    {val.user ? val.user.headline : val.company.headline}
                  </span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">
                    {val.user ? val.user.email : val.company.email}
                  </span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{val.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-4 text-center">
          No accounts matching the search criteria.
        </div>
      )}
    </section>
  );
};

export default AccountsManage;
