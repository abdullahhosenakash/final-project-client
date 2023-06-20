import React from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.config';
import { toast } from 'react-hot-toast';

const PasswordReset = () => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const userEmail = e.target.userEmail.value;
    const success = await sendPasswordResetEmail(userEmail);
    if (success) {
      toast.success('Password reset email sent');
      e.target.reset();
    }
  };
  console.log(error);
  return (
    <div>
      <h2 className='text-2xl text-center pt-2'>Reset Your Password</h2>
      <form onSubmit={(e) => handleResetPassword(e)}>
        <div class='card mx-auto w-full max-w-sm shadow-2xl bg-base-100'>
          <div class='card-body'>
            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Email</span>
              </label>
              <input
                type='text'
                placeholder='email'
                class='input input-bordered'
                name='userEmail'
                required
              />
            </div>
            <div class='form-control mt-6'>
              <button type='submit' class='btn bg-blue-200 hover:bg-blue-300'>
                Send Password Reset Email
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
