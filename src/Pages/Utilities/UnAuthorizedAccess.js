import React from 'react';
import { Link } from 'react-router-dom';

const UnAuthorizedAccess = () => {
  return (
    <div>
      <p className='text-red-700 text-center text-4xl mt-24'>
        UnAuthorized Access Detected!
      </p>
      <p className='text-center text-blue-600 text-lg'>
        <Link to='/login'>Click here to login again</Link>
      </p>
    </div>
  );
};

export default UnAuthorizedAccess;
