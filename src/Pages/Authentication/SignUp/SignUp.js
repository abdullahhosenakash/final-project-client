import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile
} from 'react-firebase-hooks/auth';
import auth from '../../../firebase.config';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, , loading, userCreationError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const updateUserProfile = async () => {
      const success = await updateProfile({ displayName: userName });
      if (success) {
        toast.success('User Created Successfully');
        navigate(from, { replace: true });
      }
    };

    if (user) {
      console.log(user);
      const newUser = { userName, userEmail, userRole };
      fetch('https://final-project-server-k11k.onrender.com/addUser', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then((res) => res.json())
        .then((data) => {
          updateUserProfile();
        });
    }
    if (userCreationError) {
      setErrorMessage(userCreationError.message);
    }
  }, [
    user,
    navigate,
    userName,
    updateProfile,
    userRole,
    userEmail,
    userCreationError,
    from
  ]);

  const handleSignUp = (e) => {
    e.preventDefault();
    setUserRole(e.target.userRole.value);
    createUserWithEmailAndPassword(userEmail, userPassword);
  };
  console.log(userCreationError);

  return (
    <div>
      <h2 className='text-center text-3xl pt-2'>Sign Up</h2>
      <form onSubmit={(e) => handleSignUp(e)}>
        <div className='card mx-auto w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <div className='flex justify-around'>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='author'
                  defaultChecked
                />
                <span className='label-text pl-1'>Author</span>
              </label>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='editor'
                />
                <span className='label-text pl-1'>Editor</span>
              </label>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='evaluator'
                />
                <span className='label-text pl-1'>Evaluator</span>
              </label>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Name</span>
              </label>
              <input
                type='text'
                placeholder='Name'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='userName'
                required
                onBlur={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='Email'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='userEmail'
                required
                onBlur={(e) => setUserEmail(e.target.value.toLowerCase())}
                onFocus={() => setErrorMessage('')}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='Password'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='userPassword'
                required
                onBlur={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div className='form-control mt-'>
              <p className='text-sm text-red-700 m-0 p-0'>{errorMessage}</p>
              <button type='submit' className='btn btn-primary'>
                Sign Up
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
