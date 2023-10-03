import React, { useState, useEffect } from "react";
import { UserApi } from "../../configs/api";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';


const Home = () => {
  const [userDetails, setUserDetails] = useState({
    username: null,
    email: null,
    headline: null,
    image: null,
  });
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false)
  const [imageSelect, setImageSelect] = useState("");


  const { register, handleSubmit, formState: { errors } } = useForm();

  const seeker = useSelector((state) => state?.seekerDetails.seekerToken);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(fileList,'-----');
  };
  const handleEditProfileView = () => {
    navigate("/edit-myProfile");
  };

  const handleSavedJobsView = () => {
    navigate("/saved-jobs");
  };

  const handleShowNewPost = () =>{
    setShowNewPost(true)
  }
  useEffect(() => {
    const handleJobDetails = async () => {
      try {
        const res = await Axios.get(
          `${UserApi}userProfile?data=${encodeURIComponent(seeker)}`
        );
        const data = res.data.seekerData;
        setUserDetails(data);
        const jobData = res.data.matchedJobs;
        setMatchedJobs(jobData);
      } catch (error) {
        console.error(error);
      }
    };
    handleJobDetails();
  }, [seeker]);


  const newPost = async (data) => {
    try {
      if (!fileList) {
        console.error("No image selected.");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", fileList[0].originFileObj
);
      formData.append("upload_preset", "user_posts"); 
  
      const imageResponse = await Axios.post(
        "https://api.cloudinary.com/v1_1/skillsetnetwork/image/upload",
        formData
      );
  
      if (imageResponse.data && imageResponse.data.secure_url) {
        console.log("Image uploaded:", imageResponse.data.secure_url);
  
        const postData = {
          caption: data.caption,
          picture: imageResponse.data.secure_url,
        };
        
        await Axios.post(`${UserApi}newPost`, {data:postData,token:seeker}).then((res)=>{
          setImageSelect("");
          setShowNewPost(false);
            toast.success(res.data.message, {
              duration: 3000,
              position: "top-right",
              style: {
                background: "#B00043",
                color: "#fff",
              },
            });
        })
      } else {
        console.error("Error uploading image: Invalid response from Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image or creating post:", error);
    }
  };
  


  return (
    <>
      <div className="w-full h-screen bg-white">
        <div className="flex flex-col md:flex-row lg:flex-row">
          <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
            <div className="bg-pink-100 w-72 m-5 h-6/6 rounded p-6 flex flex-col items-center">
              <div className="mt-8">
                {userDetails.image ? (
                  <img
                    src={userDetails.image}
                    alt="User Profile"
                    className="w-28 h-28 rounded-full"
                  />
                ) : (
                  <img
                    src="https://w7.pngwing.com/pngs/31/699/png-transparent-profile-profile-picture-human-face-head-man-woman-community-outline-schema-thumbnail.png"
                    alt="Generic placeholder image"
                    className="w-28 h-28 rounded-full"
                  />
                )}
              </div>
              <div className="mt-6 text-center">
                <h1 className="text-xl font-semibold">
                  {userDetails.username}
                </h1>
                <h2 className="text-sm text-gray-600">
                  {userDetails.headline}
                </h2>
              </div>
              <div className="mt-4 flex flex-col items-center space-y-2">
                <button
                  onClick={handleSavedJobsView}
                  className="bg-pink-600 rounded px-4 py-1 text-white"
                >
                  Saved jobs
                </button>
                <button
                  onClick={handleEditProfileView}
                  className="bg-pink-600 rounded px-4 py-1 text-white"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleEditProfileView}
                  className="bg-pink-600 rounded px-9 py-1 text-white"
                >
                  Chat
                </button>
                <div className="pt-8">
                <button
                  className="bg-pink-600 rounded px-5 py-1 text-white"
                >
                  Premium
                </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button onClick={handleShowNewPost} className="w-full md:w-[600px] xl:w-[800px] bg-pink-100 border border-pink-200 hover:bg-pink-500 shadow-md h-14 mb-2 rounded">
              New Post
            </button>
            {showNewPost ? (
              <div className="bg-gray-100 w-full md:w-[600px] xl:w-[800px] rounded p-5 h-[500px]">
              <form className="px-16" onSubmit={handleSubmit(newPost)}>
                  
                  <div class="grid grid-cols-1 space-y-1 px-10 pb-2">
                    <label class="text-sm font-bold text-gray-500 tracking-wide">
                      Attach image
                    </label>
                    <div class="flex items-center justify-center w-full">
                      <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-40 px-10 py-3 group text-center">
                      <p className="pb-1 text-gray-400">Drop a file here to upload or click to browse </p>
                        
                        <ImgCrop aspect={1/1} rotationSlider>
                            <Upload
                              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                              listType="picture-card"
                              fileList={fileList}
                              onChange={onChange}
                             
                            >
                              {fileList.length < 1 && '+ Upload'}
                            </Upload>
                          </ImgCrop>
                      </label>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 space-y-2">
                        <label htmlFor="caption" class="text-sm font-bold text-gray-500 tracking-wide">Caption</label>
                        <textarea
                      type="text"
                      id="caption"
                      {...register("caption",{required:true, pattern: /^.{2,56}$/})} 
                      className="px-3 py-2 h-28 border rounded-lg w-full"
                    ></textarea>
                    {errors.caption && errors.caption.type === "required" && <label className='text-sm text-red-600'>Please enter the caption</label>}
                    {errors.caption && errors.caption.type === "pattern"&&  <label className='text-sm text-red-600'>Please enter a valid caption (maximum 56 characters)</label>}
                    
                  </div>
                  <div className="flex justify-end">
                    {/* <button className="w-24 px-4 p-2 mt-4 border hover:text-white border-transparent rounded-full bg-pink-300  hover:bg-pink-500 transition-colors shadow-md">Cancel</button> */}
                    <button className="w-24 px-4 p-2 mt-4 ml-1 border text-white border-transparent rounded-full bg-pink-400 shadow-md hover:bg-pink-600">Post</button>
                  </div>
              </form>
            </div>
            ):(
              <div className="bg-gray-100 w-full md:w-[600px] xl:w-[800px] rounded p-5 h-[500px] overflow-y-auto">
              <h2 className="text-lg font-semibold">
                Recommended jobs for you!
              </h2>
              {matchedJobs.length === 0 ? (
              <div className="flex justify-center mt-20 pb-24">
                <div className="section text-center">
                  <h1 className="error text-xl font-bold text-pink-600">
                  Oops! No Jobs found
                  </h1>
                  <div className="page text-lg font-semibold text-gray-700 mt-4">
                    Add new skills to get job.  
                  </div>
                  <button
                  onClick={handleEditProfileView}
                  className="bg-pink-600 rounded px-3 mt-3 py-1 text-white"
                >
                  Add Skills
                </button>
                </div>
                </div>
              ):(
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {matchedJobs.map((val, i) => (
                  <li
                    className="bg-white p-4 text-center shadow-md rounded"
                    key={i}
                  >
                    <div className="bg-pink-50 h-32 mb-2">
                      <div>
                        <h3 className="font-bold">Position</h3>
                        <p className="text-sm">{val.position}</p>
                      </div>
                      <div>
                        <h3 className="font-bold">Skills</h3>
                        <p className="text-sm">
                          {val.skills.map((skill, i) => (
                            <span key={i}>
                              {skill}
                              {i !== val.skills.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <h3 className="title text-lg font-semibold">
                      {val.salary}
                    </h3>
                    <button className="bg-pink-300 text-white px-3 py-1 mt-2 rounded-md hover:bg-pink-500 transition-colors duration-300 focus:outline-none">
                      View
                    </button>
                  </li>
                ))}
                
              </ul>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
