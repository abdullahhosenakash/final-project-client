import { useEffect, useState } from 'react';

const useUserRole = (userEmail) => {
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    if (userEmail) {
      fetch(`http://localhost:5000/userRole?userEmail=${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setUserRole(data.userRole);
          }
        });
    } else {
      setUserRole('');
    }
  }, [userEmail]);
  return [userRole];
};

export default useUserRole;
