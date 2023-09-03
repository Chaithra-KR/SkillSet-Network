import React,{Fragment} from 'react';

const StartingHome = () => {
  return (
    <Fragment>
      <div className='h-16 w-full bg-white'>
        <div className='p-3.5 flex justify-end'>
            <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Companies</button> 
            <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">For Employees</button> 
            <button className="p-1  ml-5 border border-transparent rounded hover:bg-gray-50">Why SkillSet</button> 
            <button className="p-1 w-20 ml-5 border border-pink-400  text-black rounded bg-pink-100 shadow-md hover:bg-pink-400">SignUp</button> 
            <button className="p-1 w-20 ml-5 border border-transparent  text-white rounded bg-pink-500 shadow-md hover:bg-pink-400">SignIn</button> 
        </div>
      </div>
      <div className="h-96 w-full flex">
        <div className="w-6/12 bg-green-700 flex justify-center items-center">
            <h1 className='font-mono font-9xl font-bold'>How work</h1>
        </div>
        <div className="w-6/12 bg-pink-50 flex justify-center items-center">
            <img className='w-auto h-72' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtyjUKo8aO6BJMtY1tioe3Sy5Z4KnaE5M-zA&usqp=CAU" alt="trust hand" />
        </div>
      </div>

    </Fragment>
  );
}

export default StartingHome;
