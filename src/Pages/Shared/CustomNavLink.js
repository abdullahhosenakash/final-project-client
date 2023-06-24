import React from 'react';
import { NavLink } from 'react-router-dom';

const CustomNavLink = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'btn bg-slate-600 text-white hover:bg-slate-500 hover:text-white'
          : 'btn btn-primary'
      }
    >
      {children}
    </NavLink>
  );
};

export default CustomNavLink;
