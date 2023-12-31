import axios from "axios";
import React, { useEffect, useState } from "react";
import { AdminApi } from "../../configs/api";
import { Button, Modal } from "antd";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { adminAxiosInstance } from "../../configs/axios/axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [access, setAccess] = useState(false);
  const [singleUser, setSingleUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(null);

  const token = useSelector((state) => {
    return state?.adminDetails.adminToken;
  });

  useEffect(() => {
    const usersData = async () => {
      try {
        await adminAxiosInstance
          .get(`${AdminApi}userManagement?data=${encodeURIComponent(token)}`)
          .then((res) => {
            setUsers(res.data.userData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    usersData();
  }, [access]);

  const findUser = (email) => {
    console.log(users, "users");
    const User = users.find((val) => {
      return email === val.email;
    });
    setSingleUser(User);
  };

  const handleBlockUser = async (userId) => {
    const data = {
      token: token,
      userId: userId,
    };
    adminAxiosInstance.post(`${AdminApi}blockUser`, { data }).then((res) => {
      if (res.data.success) {
        if (access === true) {
          setAccess(false);
        } else {
          setAccess(true);
        }
        toast.success(res.data.message, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
      }
    });
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const handleUnBlockUser = async (userId) => {
    const data = {
      token: token,
      userId: userId,
    };
    adminAxiosInstance.post(`${AdminApi}unblockUser`, { data }).then((res) => {
      if (res.data.success) {
        if (access === true) {
          setAccess(false);
        } else {
          setAccess(true);
        }
        toast.success(res.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#B00043",
            color: "#fff",
          },
        });
      } else {
        toast.error("something went wrong !");
      }
    });
  };

  const showModal = (index) => {
    setIsSkillModalOpen(index);
  };

  const handleCancel = () => {
    setIsSkillModalOpen(null);
  };

  return (
    <section className="h-full overflow-scroll">
      <h1 className="flex justify-center pb-5 text-3xl">User Management</h1>
      <table className="w-11/12 ml-8 min-w-max table-auto text-left bg-gray-50">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-normal leading-none opacity-70">
                SI No:
              </span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-normal leading-none opacity-70">
                user ID
              </span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-normal leading-none opacity-70">Name</span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-normal leading-none opacity-70">Email</span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 pl-10">
              <span className="font-normal leading-none opacity-70">
                Skills
              </span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 pl-10">
              <span className="font-normal leading-none opacity-70">
                Action
              </span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 pl-10">
              <span className="font-normal leading-none opacity-70">View</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user._id}>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{i + 1}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{user._id}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{user.username}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <span className="font-normal">{user.email}</span>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Button
                  className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-blue-500 
                shadow-md hover:bg-blue-400"
                  type="blue"
                  onClick={() => showModal(i)}
                  key={user._id}
                >
                  View
                </Button>
                <Modal
                  open={isSkillModalOpen === i}
                  footer={null}
                  onCancel={handleCancel}
                  title="List of skills"
                >
                  {user.skills.map((skill, i) => (
                    <>
                      <p>{i + 1 + ". " + skill}</p>
                    </>
                  ))}
                </Modal>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                {user.access === true ? (
                  <button
                    onClick={() => handleUnBlockUser(user._id)}
                    className="p-1 w-20 ml-5 border border-transparent text-white rounded bg-blue-500 shadow-md hover:bg-blue-400"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockUser(user._id)}
                    className="p-1 w-20 ml-5 border border-transparent text-white rounded bg-blue-500 shadow-md hover:bg-blue-400"
                  >
                    Block
                  </button>
                )}
              </td>

              <td className="p-4 border-b border-blue-gray-50">
                <Button
                  className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-blue-500 
                shadow-md hover:bg-blue-400"
                  type="blue"
                  onClick={() => {
                    setIsModalOpen(true);
                    findUser(user.email);
                  }}
                >
                  Details
                </Button>
              </td>

              <Modal
                title="Other details"
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                  setIsModalOpen(false);
                }}
              >
                <p>Date of birth : {formatDate(singleUser.dob)}</p>
                <p>Contact No : {singleUser.phone} </p>
                {singleUser.experience ? (
                  <p>Experience : {singleUser.experience}</p>
                ) : (
                  <div></div>
                )}
                <p>Headline : {singleUser.headline}</p>
                {singleUser.appliedJobs ? (
                  <p>
                    Applied Jobs :{singleUser.appliedJobs.map((val) => val)}
                  </p>
                ) : (
                  <div></div>
                )}
              </Modal>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
