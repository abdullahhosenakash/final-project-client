import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../firebase.config';

const useToken = () => {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const userEmail = user?.email;
    setTokenLoading(true);
    userEmail &&
      fetch(
        `https://final-project-server-liard.vercel.app/user-login?userEmail=${userEmail}`
      )
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('accessToken', data?.token);
          setToken(data?.token);
          setTokenLoading(false);
        });
  }, [user]);
  return [token, tokenLoading];
};

export default useToken;
