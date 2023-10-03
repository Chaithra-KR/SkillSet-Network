import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { AdminApi } from '../../configs/api';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0)
  const [companyCount, setCompanyCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [premiumAccountsCount, setPremiumAccountsCount] = useState(0)


  useEffect(() => {
    try {
      const handleDashboard = async()=>{
        await axios.get(`${AdminApi}viewDashboard`).then((res)=>{
          const usersCount = res.data.usersCount
          setUserCount(usersCount)
          const companiesCount = res.data.companiesCount
          setCompanyCount(companiesCount)
          const revenue = res.data.revenue
          setRevenue(parseInt(revenue))
          setPremiumAccountsCount(res.data.premiumAccountsCount)
        })
      }
      handleDashboard()
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log(revenue);
  const chartData = [
    ['dashboard', 'Mhl'],
    ['companies', companyCount],
    ['users', userCount],
    ['Premium accounts', premiumAccountsCount]
  ];

  return (
    <section className="container mx-auto p-4">
      
      <div className="mt-4 flex">
        <Chart
          chartType="PieChart"
          width={'85%'}
          height={'600px'}
          className="chart-container"
          data={chartData}
          options={{
            title: 'World Wide record for SkillSet Network',
            is3D: true,
          }}
        />
        <div>
          <div className="bg-gray-100 rounded-lg p-3 h-24 w-72 m-7">
            <h3 className="text-lg text-gray-600">Total profit :</h3>
            <p className="text-2xl text-gray-500"><span className="font-bold ml-16">Rs.{revenue}/-</span></p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 h-24 w-72 m-7">
            <h3 className="text-lg text-gray-600"> Premium accounts</h3>
            <p className="text-sm text-gray-500">Total Premium accounts: <span className="font-bold text-xl">{premiumAccountsCount}</span></p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 h-24 w-72 m-7">
            <h3 className="text-lg text-gray-600"> users</h3>
            <p className="text-sm text-gray-500">Total users: <span className="font-bold text-xl">{userCount}</span></p>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 h-24 w-72 m-7">
            <h3 className="text-lg text-gray-600"> Companies</h3>
            <p className="text-sm text-gray-500">Total Companies: <span className="font-bold text-xl">{companyCount}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
