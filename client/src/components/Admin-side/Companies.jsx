import React from 'react';

const Companies = () => {
    const TABLE_HEAD = ["Company", "Job", "Employed", ""];
    const TABLE_ROWS = [
      {
        name: "John Michael",
        job: "Manager",
        date: "23/04/18",
      },
      {
        name: "Alexa Liras",
        job: "Developer",
        date: "23/04/18",
      },
      {
        name: "Laurent Perrier",
        job: "Executive",
        date: "19/09/17",
      },
      {
        name: "Michael Levi",
        job: "Developer",
        date: "24/12/08",
      },
      {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
      },
    ];
  
    return (
      <div className="w-full h-screen bg-white text-black font-roboto">
        <div className="flex h-screen rounded border w-full border-gray-50 p-4">
          <div className="w-2/12 bg-white p-4 text-white text-xl">
            <div className="ml-7 mb-4">
              <button className="bg-gray-50 w-44 hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Dashboard</button>
            </div>
            <div className="ml-7 mb-4">
              <button className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Users</button>
            </div>
            <div className="ml-7 mb-4">
              <button className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Companies</button>
            </div>
            <div className="ml-7 mb-4">
              <button className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">Accounts</button>
            </div>
            <div className="ml-7 mb-4">
              <button className="bg-gray-50 w-44  hover:bg-pink-50 text-black px-5 py-2 rounded-lg">SignOut</button>
            </div>
          </div>
          <div className="w-10/12 border-1 border-solid text-black relative">
            <div className="h-full overflow-scroll">
              <h1 className='flex justify-center p-5 text-3xl'>Company Management</h1>
              <table className="w-11/12 ml-8 min-w-max table-auto text-left  bg-pink-50">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <span className="font-normal leading-none opacity-70">
                          {head}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map(({ name, job, date }, index) => {
                    const isLast = index === TABLE_ROWS.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
  
                    return (
                      <tr key={name}>
                        <td className={classes}>
                          <span className="font-normal">{name}</span>
                        </td>
                        <td className={classes}>
                          <span className="font-normal">{job}</span>
                        </td>
                        <td className={classes}>
                          <span className="font-normal">{date}</span>
                        </td>
                        <td className={classes}>
                          <a href="#" className="font-medium">
                            Edit
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Companies;
