import React, { useEffect, useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.config';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Loading from '../../Utilities/Loading';

const PasswordReset = () => {
  const [sendPasswordResetEmail, sending, passwordResetError] =
    useSendPasswordResetEmail(auth);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const userEmail = e.target.userEmail.value;
    const success = await sendPasswordResetEmail(userEmail);
    if (success) {
      toast.success('Password reset email sent');
      e.target.reset();
    }
  };

  useEffect(() => {
    if (
      passwordResetError?.message === 'Firebase: Error (auth/user-not-found).'
    ) {
      setErrorMessage('User not found');
    } else if (
      passwordResetError?.message === 'Firebase: Error (auth/invalid-email).'
    ) {
      setErrorMessage('Invalid Email');
    } else if (passwordResetError?.message) {
      setErrorMessage(passwordResetError?.message);
    }
  }, [passwordResetError]);

  return (
    <div>
      <h2 className='text-2xl text-center pt-2'>Reset Your Password</h2>
      <form onSubmit={(e) => handleResetPassword(e)}>
        <div
          className={`card mx-auto w-full max-w-sm shadow-2xl bg-base-100 ${
            sending && '!opacity-50'
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
                  disabled={sending}
                  autoComplete='off'
                  onChange={() => setErrorMessage('')}
                />
                <label
                  htmlFor='userEmail'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Email
                </label>
              </div>
              {errorMessage && (
                <p className='text-sm text-center text-red-700 m-0 pt-1'>
                  {errorMessage}
                </p>
              )}
            </div>
            <div className='form-control'>
              <button
                type='submit'
                className='btn btn-primary flex'
                disabled={sending}
              >
                Send Password Reset Email {sending && <Loading />}
              </button>
              <p className='pt-1'>
                Password recovered?{' '}
                <Link to='/login' className='text-blue-500 cursor-pointer'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
