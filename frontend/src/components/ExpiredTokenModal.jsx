import React from "react";

const ExpiredTokenModal = ({ onClose }) => {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='bg-white p-6 rounded-lg shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-2xl font-bold mb-4 text-center'>Session Expired</h2>
        <p className='mb-6 text-center'>
          Your session has expired. Please log in again.
        </p>
        <div className='flex justify-center'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg'
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredTokenModal;
