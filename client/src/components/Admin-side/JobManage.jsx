import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AdminApi } from "../../configs/api";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { FaTrash } from "react-icons/fa";
import { adminAxiosInstance } from "../../configs/axios/axios";

const JobManage = () => {
  const [open, setOpen] = useState(false);
  const [positions, setJobPositions] = useState({});
  const [refresh, setRefresh] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const admin = useSelector((state) => {
    return state?.adminDetails.adminToken;
  });

  const handleJobSubmit = async (data) => {
    try {
      axios
        .post(`${AdminApi}jobPosition`, { data: data, token: admin })
        .then((res) => {
          if (refresh === true) {
            setRefresh(false);
          } else {
            setRefresh(true);
          }
          if (res.data.success == true) {
            toast.success(res.data.message, {
              duration: 3000,
              position: "top-right",
              style: {
                background: "#B00043",
                color: "#fff",
              },
            });
          } else {
            toast.error(res.data.message, {
              duration: 3000,
              position: "top-center",
              style: {
                background: "#ff0000",
                color: "#fff",
              },
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const showJobManagement = async () => {
      try {
        axios
          .get(`${AdminApi}viewJobManage?data=${encodeURIComponent(admin)}`)
          .then((res) => {
            let jobPosition = res.data.jobPosition;
            setJobPositions(jobPosition);
          });
      } catch (error) {
        console.log(error);
      }
    };
    showJobManagement();
  }, [refresh]);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <section className="h-full overflow-scroll">
      <h1 className="flex justify-center pb-5 text-3xl">Job Management</h1>
      <div className="flex justify-end mr-16 mb-5">
        <Button
          className="p-1 w-20 ml-5 border border-transparent text-white rounded bg-pink-500 shadow-md hover:bg-pink-400"
          onClick={showModal}
        >
          New Job
        </Button>
        <Modal title="Title" open={open} onCancel={handleCancel}>
          <form className=" w-96" onSubmit={handleSubmit(handleJobSubmit)}>
            <div className="flex justify-between">
              <label htmlFor="job" className="px-3 py-2 ">
                Job:
              </label>
              <input
                {...register("job", {
                  pattern: /^.{1,56}$/,
                  required: true,
                })}
                type="text"
                id="job"
                className="px-3 py-2 border rounded-lg w-full"
              />

              <button className="ml-1 px-4 py-2 border rounded-lg shadow bg-pink-600 text-white">
                Save
              </button>
            </div>
            {errors.job && errors.job.type === "required" && (
              <label className="ml-24 text-sm text-red-600">
                Please enter the job
              </label>
            )}
            {errors.job && errors.job.type === "pattern" && (
              <label className=" ml-18 text-sm text-red-600">
                Please enter a valid job (maximum 56 characters)
              </label>
            )}
          </form>
        </Modal>
      </div>
      <table className="w-11/12 ml-8 min-w-max table-auto text-left bg-pink-50">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-bold leading-none opacity-70">SI No:</span>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-bold leading-none opacity-70">
                Position ID
              </span>
            </th>

            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className=" font-bold leading-none opacity-70">
                Job position
              </span>
            </th>

            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <span className="font-bold leading-none opacity-70">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 ? (
            positions.map((position, i) => (
              <tr key={position._id}>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{i + 1}</span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{position._id}</span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal">{position.position}</span>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <span className="font-normal cursor-pointer">
                    <FaTrash />
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <div hidden>No job positions! </div>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default JobManage;
