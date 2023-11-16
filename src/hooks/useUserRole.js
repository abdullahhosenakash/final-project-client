import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import auth from '../firebase.config';
import { useNavigate } from 'react-router-dom';

const useUserRole = (userEmail) => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (userEmail) {
      fetch(
        `https://final-project-server-k11k.onrender.com/userRole?userEmail=${userEmail}`,
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
            setUserRole(data.userRole);
          }
        });
    } else {
      setUserRole('');
    }
  }, [userEmail, navigate]);
  return [userRole];
};

export default useUserRole;
