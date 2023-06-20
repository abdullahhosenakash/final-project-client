import React from 'react';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../../firebase.config';

const Login = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate(auth);
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleLogin = (e) => {
    e.preventDefault();
    const userEmail = e.target.userEmail.value;
    const userPassword = e.target.userPassword.value;
    if (userEmail && userPassword) {
      signInWithEmailAndPassword(userEmail, userPassword);
    }

    if (user) {
      console.log(user);
      navigate('/', { replace: true });
    }

    console.log(user);
  };
  return (
    <div>
      <h2 className='text-center text-3xl'>Login</h2>
      <form onSubmit={(e) => handleLogin(e)}>
        <div class='card mx-auto w-full max-w-sm shadow-2xl bg-base-100'>
          <div class='card-body'>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='email'
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
                placeholder='password'
                class='input input-bordered'
                name='userPassword'
                required
              />
              <label class='label'>
                <Link
                  to='/resetPassword'
                  class='label-text-alt link link-hover'
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div class='form-control mt-6'>
              <button type='submit' class='btn bg-blue-200 hover:bg-blue-300'>
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
