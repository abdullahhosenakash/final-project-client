import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import CustomNavLink from '../Shared/CustomNavLink';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/userRole?userEmail=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setUserRole(data.userRole);
          }
        });
    } else {
      setUserRole('');
    }
  }, [user]);

  console.log(userRole);

  // const CustomNavLink = (to,children) => (
  //   <NavLink
  //     to={to}
  //     className={({ isActive }) =>
  //       isActive
  //         ? 'btn btn-primary'
  //         : 'btn bg-slate-600 text-white hover:bg-slate-500 hover:text-white'
  //     }
  //   >
  //     {children}
  //   </NavLink>
  // );
  return (
    <div>
      <div className='bg-secondary fixed inset-y-0 w-1/4 p-[1%]'>
        <div className='navbar bg-secondary'>
          <div className='navbar-start'>
            <div className='dropdown'>
              <label tabIndex={0} className='btn btn-ghost btn-circle'>
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
                    d='M4 6h16M4 12h16M4 18h7'
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-secondary rounded-box w-52'
              >
                <li>
                  <a>Homepage</a>
                </li>
                <li>
                  <a>Portfolio</a>
                </li>
                <li>
                  <a>About</a>
                </li>
              </ul>
            </div>
          </div>
          <div className='navbar-center'>
            <Link to='/' className='btn btn-ghost normal-case text-xl'>
              Journal
            </Link>
          </div>
          <div className='navbar-end'>
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
          </div>
        </div>

        <div className='divider mt-0 mb-2'></div>

        <div className='flex flex-col gap-2'>
          {user ? (
            <>
              <CustomNavLink to='/'>Home</CustomNavLink>
              {userRole === 'author' ? (
                <CustomNavLink to='/newArticle'>Post an Article</CustomNavLink>
              ) : (
                ''
              )}
              <CustomNavLink to='/availableArticles'>
                See Available Articles
              </CustomNavLink>
              <CustomNavLink to='/profile' className='btn btn-primary'>
                Profile
              </CustomNavLink>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setUserRole('');
                  signOut(auth);
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <p className='text-center text-3xl'>
                Please login to see options
              </p>
              {/* <Link to='/login' className='btn btn-primary'>
                Login Now
              </Link> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
