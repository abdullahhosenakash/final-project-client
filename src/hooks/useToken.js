import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../firebase.config';

const useToken = () => {
  const [token, setToken] = useState('');
  const [user] = useAuthState(auth);
  useEffect(() => {
    const userEmail = user?.email;
    userEmail &&
      fetch(
        `https://final-project-server-k11k.onrender.com/user-login?userEmail=${userEmail}`
      )
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('accessToken', data?.token);
          setToken(data?.token);
        });
  }, [user]);
  return [token];
};

export default useToken;
