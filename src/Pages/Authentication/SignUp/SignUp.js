import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useUpdateProfile
} from 'react-firebase-hooks/auth';
import auth from '../../../firebase.config';
import { toast } from 'react-hot-toast';
import Loading from '../../Utilities/Loading';
import { signOut } from 'firebase/auth';

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
  const [updateProfile, updating] = useUpdateProfile(auth);
  const [sendEmailVerification, sending] = useSendEmailVerification(auth);

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const updateUserProfile = async () => {
      const updateSuccess = await updateProfile({ displayName: userName });
      const verificationMailSendSuccess = await sendEmailVerification();
      if (updateSuccess && verificationMailSendSuccess) {
        toast.success(
          'User Created Successfully. Email verification mail sent.'
        );
        navigate(from, { replace: true });
      }
    };

    if (user) {
      const newUser = { userName, userEmail, userRole };
      fetch('http://localhost:5000/addUser', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newUser)
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('accessToken');
            signOut(auth);
            navigate('/unauthorizedAccess', { replace: true });
            return;
          } else {
            return res.json();
          }
        })
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
    from,
    sendEmailVerification
  ]);

  const handleSignUp = (e) => {
    e.preventDefault();
    setUserRole(e.target.userRole.value);
    createUserWithEmailAndPassword(userEmail, userPassword);
  };

  return (
    <div>
      <h2 className='text-center text-3xl pt-2'>Sign Up</h2>
      <form onSubmit={(e) => handleSignUp(e)}>
        <div
          className={`card mx-auto w-full max-w-sm shadow-2xl bg-base-100 ${
            (sending || updating || loading) && '!opacity-50'
          }`}
        >
          <div className='card-body'>
            <div className='flex gap-3 justify-center'>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='author'
                  defaultChecked
                  disabled={loading || sending || updating}
                />
                <span className='label-text pl-1'>Author</span>
              </label>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='editor'
                  disabled={loading || sending || updating}
                />
                <span className='label-text pl-1'>Editor</span>
              </label>
              <label className='label cursor-pointer'>
                <input
                  type='radio'
                  name='userRole'
                  className='radio'
                  value='reviewer'
                  disabled={loading || sending || updating}
                />
                <span className='label-text pl-1'>Reviewer</span>
              </label>
            </div>
            <div className='form-control'>
              <div className='relative'>
                <input
                  type='text'
                  id='userName'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                  placeholder=''
                  autoComplete='off'
                  name='userName'
                  required
                  disabled={loading || sending || updating}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <label
                  htmlFor='userName'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Name
                </label>
              </div>
            </div>
            <div className='form-control'>
              <div className='relative'>
                <input
                  type='email'
                  id='userEmail'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                  placeholder=''
                  name='userEmail'
                  required
                  autoComplete='off'
                  disabled={loading || sending || updating}
                  onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                  onFocus={() => setErrorMessage('')}
                />
                <label
                  htmlFor='userEmail'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Email
                </label>
              </div>
            </div>
            <div className='form-control'>
              <div className='relative'>
                <input
                  type='password'
                  id='userPassword'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                  placeholder=''
                  autoComplete='off'
                  name='userPassword'
                  required
                  disabled={loading || sending || updating}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
                <label
                  htmlFor='userPassword'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Password
                </label>
              </div>
            </div>
            <div className='form-control mt-'>
              <p className='text-sm text-red-700 m-0 p-0'>{errorMessage}</p>
              <button
                type='submit'
                className='btn btn-primary disabled:bg-slate-500'
                disabled={loading || updating || sending}
              >
                {loading || updating || sending ? (
                  <>
                    Signing Up
                    <Loading />{' '}
                  </>
                ) : (
                  'Sign Up'
                )}
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
