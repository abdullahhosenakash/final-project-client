import React, { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../../../firebase.config';
import Loading from '../../Utilities/Loading';
import useToken from '../../../hooks/useToken';

const Login = () => {
  const navigate = useNavigate(auth);
  const [token, tokenLoading] = useToken();
  const location = useLocation();
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);
  const from = location.state?.from?.pathname || '/';
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const userEmail = e.target.userEmail.value;
    const userPassword = e.target.userPassword.value;
    signInWithEmailAndPassword(userEmail, userPassword);
  };

  useEffect(() => {
    if (error?.message === 'Firebase: Error (auth/user-not-found).') {
      setErrorMessage('User not found!');
    } else if (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } else {
      setErrorMessage('');
    }

    if (!tokenLoading && token) {
      navigate(from, { replace: true });
    }
  }, [token, tokenLoading, navigate, from, error]);

  return (
    <div>
      <h2 className='text-center text-3xl'>Login</h2>
      <form onSubmit={(e) => handleLogin(e)}>
        <div
          className={`card mx-auto w-full max-w-sm shadow-2xl bg-base-100 ${
            loading && '!opacity-50'
          }`}
        >
          <div className='card-body'>
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
                  disabled={loading}
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
                  name='userPassword'
                  required
                  autoComplete='off'
                  disabled={loading}
                />
                <label
                  htmlFor='userPassword'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Password
                </label>
              </div>
              <label className='label'>
                <Link
                  to='/resetPassword'
                  className='label-text-alt link link-hover'
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className='form-control'>
              <p className='text-red-600 py-1 text-center'>{errorMessage}</p>
              <button
                type='submit'
                className='btn btn-primary disabled:bg-slate-500'
                disabled={loading}
              >
                {loading ? (
                  <>
                    Logging in
                    <Loading />{' '}
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <p className='pt-2'>
                Don't have an account?{' '}
                <Link
                  to='/signUp'
                  className='pl-1 text-blue-600 hover:underline'
                >
                  Sign Up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
