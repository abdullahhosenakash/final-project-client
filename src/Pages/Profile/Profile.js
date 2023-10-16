import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';

const Profile = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h2 className='text-center text-3xl'>
        Welcome to your profile {user?.displayName}
      </h2>
    </div>
  );
};

export default Profile;
