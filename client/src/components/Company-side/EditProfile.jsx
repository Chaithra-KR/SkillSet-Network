import React from 'react';

const EditProfile = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-pink-50">
      <div className="w-full max-w-md p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
            <h2 className="text-center text-2xl mb-4 text-gray-800">Edit Profile!</h2>
            <fieldset className='pb-4'>
            <ul>
                <li className="grid gap-2">
                  <label htmlFor="username" className="text-left">Company name:</label>
                  <input type="text" id="username" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="startedDate" className="text-left">Started date:</label>
                  <input type="date" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="phone" className="text-left"> Contact No:</label>
                  <input type="phone" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="address" className="text-left"> Address:</label>
                  <input type="text" id="startedDate" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="about" className="text-left">About:</label>
                  <input type="text" id="about" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="email" className="text-left">Email:</label>
                  <input type="email" id="email" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
                <li className="grid gap-2">
                  <label htmlFor="password" className="text-left">Password:</label>
                  <input type="password" id="password" required className="px-3 py-2 border rounded-lg w-full" />
                </li>
              </ul>
            </fieldset>
            <button className="px-4 py-2 border w-full rounded-lg shadow hover:bg-gray-200 hover:border-gray-300">Submit</button>
      </div>
    </div>
  );
}

export default EditProfile;
