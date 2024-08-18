import React, { useState } from "react";

const ChangeData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSave = () => {
    alert("Save functionality not implemented yet");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg text-center w-full lg:w-5/12 min-h-[300px]'>
        <h2 className='text-2xl font-bold mb-6'>Change User Data</h2>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            First Name
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 border rounded-lg'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Last Name
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 border rounded-lg'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button
          className='mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1'
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangeData;
