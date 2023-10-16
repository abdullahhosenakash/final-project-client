import React, { useEffect, useState } from 'react';
import {
  useAuthState,
  useSignInWithEmailAndPassword
} from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../../../firebase.config';

const Login = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate(auth);
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
  // console.log(error);

  useEffect(() => {
    if (error?.message === 'Firebase: Error (auth/user-not-found).') {
      setErrorMessage('User not found!');
    } else if (error) {
      setErrorMessage('Something went wrong. Please try again.');
    } else {
      setErrorMessage('');
    }

    if (user) {
      // console.log('aaa');
      // fetch(`https://final-project-server-k11k.onrender.com/userRole?userEmail=${user.email}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data) {
      //       localStorage.setItem('userRole', data.userRole);
      navigate(from, { replace: true });
      // }
      // });
      // } else {
      //   localStorage.removeItem('userRole');
    }
  }, [user, navigate, from, error]);
  return (
    <div>
      <h2 className='text-center text-3xl'>Login</h2>
      <form onSubmit={(e) => handleLogin(e)}>
        <div className='card mx-auto w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='email'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='userEmail'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='password'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='userPassword'
                required
              />
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
              <button type='submit' className='btn btn-primary'>
                Login
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
