import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { signOut } from 'firebase/auth';
import CustomNavLink from '../Shared/CustomNavLink';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../Utilities/Loading';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userRole] = useUserRole(user?.email);
  const navigate = useNavigate();

  // console.log(userRole);

  return (
    <div>
      <div className='bg-secondary fixed inset-y-0 w-[30%] p-[1%]'>
        <div className='navbar bg-secondary justify-center'>
          <div className='navbar-center flex-col'>
            <Link to='/' className='btn btn-ghost normal-case lg:text-lg'>
              JOURNAL OF SCIENCE AND TECHNOLOGY
            </Link>
            <span className='w-3/4 text-center'>
              Hajee Mohammad Danesh Science and Technology University
            </span>
          </div>
          {/* <div className='navbar-end'>
            <button className='btn btn-ghost btn-circle'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
            <button className='btn btn-ghost btn-circle'>
              <div className='indicator'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
                </svg>
                <span className='badge badge-xs badge-primary indicator-item'></span>
              </div>
            </button>
          </div> */}
        </div>

        <div className='divider mt-0 mb-2'></div>

        <div className='flex flex-col gap-2'>
          {user ? (
            <>
              {/* <CustomNavLink to='/'>Home</CustomNavLink> */}
              {userRole ? (
                <>
                  {userRole === 'author' ? (
                    <>
                      <CustomNavLink to='/newManuscript'>
                        Add Manuscript as Author
                      </CustomNavLink>
                      <CustomNavLink to='/drafts'>View Drafts</CustomNavLink>
                    </>
                  ) : (
                    ''
                  )}
                  <CustomNavLink
                    to={`${
                      userRole === 'reviewer'
                        ? '/manuscriptsAsReviewer'
                        : '/manuscriptsAsCoAuthor'
                    }`}
                  >
                    Manuscripts as{' '}
                    {userRole === 'reviewer' ? 'Reviewer' : 'Co-Author'}
                  </CustomNavLink>
                  <CustomNavLink to='/profile' className='btn btn-primary'>
                    Profile
                  </CustomNavLink>
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      signOut(auth);
                      navigate('/', { replace: true });
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div>
                  <p className='text-center text-lg'>Please wait</p>
                  <Loading loadingStyles='loading-lg block mx-auto mt-4' />
                </div>
              )}
            </>
          ) : (
            <>
              <p className='text-center text-3xl'>
                Please{' '}
                <Link to='/login' className='text-blue-500 hover:underline'>
                  login
                </Link>{' '}
                to see options
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
