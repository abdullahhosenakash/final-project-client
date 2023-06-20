import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';
import auth from '../../../firebase.config';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  useEffect(() => {
    const updateUserProfile = async () => {
      const success = await updateProfile({ displayName: userName });
      if (success) {
        toast.success('User Created Successfully');
        navigate('/', { replace: true });
      }
    };

    if (user) {
      console.log(user);
      updateUserProfile();
    }
  }, [user, navigate, userName, updateProfile]);

  const handleSignUp = (e) => {
    e.preventDefault();
    const inputtedUserName = e.target.userName.value;
    const userEmail = e.target.userEmail.value;
    const userPassword = e.target.userPassword.value;
    setUserName(inputtedUserName);
    if (userEmail && userPassword) {
      createUserWithEmailAndPassword(userEmail, userPassword);
    }
  };

  return (
    <div>
      <h2 className='text-center text-3xl pt-2'>Sign Up</h2>
      <form onSubmit={(e) => handleSignUp(e)}>
        <div class='card mx-auto w-full max-w-sm shadow-2xl bg-base-100'>
          <div class='card-body'>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Name</span>
              </label>
              <input
                type='text'
                placeholder='Name'
                class='input input-bordered'
                name='userName'
                required
              />
            </div>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='Email'
                class='input input-bordered'
                name='userEmail'
                required
              />
            </div>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='Password'
                class='input input-bordered'
                name='userPassword'
                required
              />
            </div>
            <div class='form-control mt-6'>
              <button type='submit' class='btn bg-blue-200 hover:bg-blue-300'>
                Login
              </button>
              <p className='pt-2'>
                Already have an account?{' '}
                <Link
                  to='/login'
                  className='pl-1 text-blue-600 hover:underline'
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
