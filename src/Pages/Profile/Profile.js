import React, { useEffect, useState } from 'react';
import {
  useAuthState,
  useSendEmailVerification
} from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import Loading from '../Utilities/Loading';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profileEditing, setProfileEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [sendEmailVerification, sending] = useSendEmailVerification(auth);
  const navigate = useNavigate();

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfileUpdating(true);
    const updatedProfile = {
      userName: fullName,
      phoneNumber,
      address
    };
    fetch(
      `https://final-project-server-k11k.onrender.com/updateUser?userEmail=${user?.email}`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updatedProfile)
      }
    )
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
        if (data.acknowledged) {
          toast.success('Profile updated successfully!');
          setProfileUpdating(false);
          setProfileEditing(false);
          setIsModified(!isModified);
        }
      });
  };

  useEffect(() => {
    setDataLoading(true);
    fetch(
      `https://final-project-server-k11k.onrender.com/userInfo?userEmail=${user?.email}`,
      {
        method: 'get',
        headers: {
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )
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
        if (data) {
          setFullName(data.userName);
          setPhoneNumber(data.phoneNumber);
          setAddress(data.address);
          setDataLoading(false);
        }
      });
    setUserEmail(user?.email);
  }, [user, isModified, navigate]);

  const handleEmailVerify = async () => {
    const verificationMailSendSuccess = await sendEmailVerification();
    if (verificationMailSendSuccess) {
      toast.success('Email verification mail sent.');
      setIsModified(!isModified);
    }
  };

  return (
    <div>
      <h2 className='text-center text-3xl'>Profile</h2>
      <form onSubmit={(e) => handleProfileUpdate(e)}>
        <div className='card w-full max-w-xl min-w-md mx-auto shadow-2xl p-8 bg-base-100'>
          <div className='flex items-center justify-between h-6'>
            <p className='text-md'>Full Name</p>
            {!dataLoading ? (
              fullName || profileEditing ? (
                <input
                  type='text'
                  className='w-3/4 px-2.5 py-1 disabled:text-end rounded-lg disabled:border-0 border border-secondary hover:input-primary focus:input-primary focus:outline-0 disabled:bg-white'
                  value={fullName}
                  disabled={!profileEditing}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                />
              ) : (
                <p>Not set yet</p>
              )
            ) : (
              <Loading loadingStyles='mr-3' />
            )}
          </div>

          <div className='divider' />

          <div className='flex items-center justify-between h-6'>
            <p className='text-md'>Email</p>
            <input
              type='email'
              className={`w-3/4 px-2.5 py-1 text-end rounded-lg border-0 border-secondary bg-white disabled:text-slate-700 ${
                profileEditing && '!text-start !border !bg-slate-100'
              } ${!user?.emailVerified && '!text-red-600'}`}
              value={user?.emailVerified ? userEmail : `${userEmail} **`}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled
            />
          </div>

          <div className='divider' />

          <div className='flex items-center justify-between h-6'>
            <p className='text-md'>Phone Number</p>
            {!dataLoading ? (
              phoneNumber || profileEditing ? (
                <input
                  type='text'
                  className='w-3/4 px-2.5 py-1 disabled:text-end rounded-lg disabled:border-0 border border-secondary hover:input-primary focus:input-primary focus:outline-0 disabled:bg-white'
                  value={phoneNumber}
                  disabled={!profileEditing}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              ) : (
                <p className='text-red-700'>Please set your phone number</p>
              )
            ) : (
              <Loading loadingStyles='mr-3' />
            )}
          </div>

          <div className='divider' />

          <div className='flex items-center justify-between h-6'>
            <p className='text-md'>Address</p>
            {!dataLoading ? (
              address || profileEditing ? (
                <input
                  type='text'
                  className='w-3/4 px-2.5 py-1 disabled:text-end rounded-lg disabled:border-0 border border-secondary hover:input-primary focus:input-primary focus:outline-0 disabled:bg-white'
                  value={address}
                  disabled={!profileEditing}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              ) : (
                <p className='text-red-700'>Please set your address</p>
              )
            ) : (
              <Loading loadingStyles='mr-3' />
            )}
          </div>

          <div className='divider' />

          <button
            className={`btn btn-sm btn-primary ${profileEditing && 'hidden'}`}
            onClick={(e) => {
              e.preventDefault();
              setProfileEditing(true);
            }}
          >
            Edit Profile
          </button>

          <div
            className={`flex justify-between ${!profileEditing && 'hidden'}`}
          >
            <button
              className='btn btn-sm btn-primary disabled:bg-slate-500 w-[49%]'
              disabled={profileUpdating}
            >
              Save Info {profileUpdating && <Loading />}
            </button>
            <button
              className='btn btn-sm btn-primary w-[49%]'
              onClick={(e) => {
                e.preventDefault();
                setProfileEditing(false);
                setIsModified(!isModified);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      {!user?.emailVerified && (
        <>
          <div className='flex justify-center items-center text-lg mt-2'>
            <p className='text-red-600'>
              ** Your email is not verified. To verify it now,
            </p>
            <div className='relative'>
              <button
                className='text-blue-700 hover:underline disabled:hover:no-underline ml-2'
                onClick={() => handleEmailVerify()}
                disabled={sending}
              >
                click here{' '}
                {sending && (
                  <Loading loadingStyles='absolute top-0 right-[-30px]' />
                )}
              </button>
            </div>
          </div>
          <p className='text-center text-lg'>
            Already verified?{' '}
            <button
              className='text-blue-700 hover:underline'
              onClick={() => navigate(0)}
            >
              Refresh Now
            </button>
          </p>
          {(!address || !phoneNumber || !user?.emailVerified) && (
            <p className='text-4xl text-red-500 text-center'>
              You must update your profile first
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
