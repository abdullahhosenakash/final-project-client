import { useEffect } from 'react';
import useToken from '../../hooks/useToken';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const UpdateProfile = () => {
  const [token, tokenLoading] = useToken();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !tokenLoading && token) {
      if (!user.emailVerified) {
        navigate('/profile', { replace: true });
      } else {
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
            if (!data.phoneNumber || !data.address) {
              navigate('/profile', { replace: true });
            }
          });
      }
    }
  }, [navigate, token, tokenLoading, user]);
};

export default UpdateProfile;
