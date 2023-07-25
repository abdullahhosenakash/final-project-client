import React, { useEffect, useState } from 'react';
import './AvailableArticles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { Link } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';

const AvailableArticles = () => {
  const [menuscripts, setMenuscripts] = useState([]);
  const [user] = useAuthState(auth);
  const { email } = user || {};
  const [userRole] = useUserRole(email);
  // console.log(user);
  const authorLink = `http://localhost:5000/authorArticles?authorEmail=${email}`;
  // const authorLink = `http://localhost:5000/authorArticles?authorEmail=${email}`;
  const editorLink = 'https://final-project-server-k11k.onrender.com/articles';

  useEffect(() => {
    fetch(userRole === 'author' ? authorLink : editorLink)
      .then((res) => res.json())
      .then((data) => setMenuscripts(data));
  }, [email, authorLink, userRole]);

  console.log(menuscripts);
  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Menuscripts</h2>
      <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
        <table className='table text-center'>
          {/* head */}
          <thead className='bg-gray-200 text-slate-900'>
            <tr>
              <th className='w-[10%]'>ID</th>
              <th>Title</th>
              <th>Author Name</th>
              <th>Date</th>
              <th className='w-[10%]'>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {menuscripts.toReversed().map((menuscript, index) => (
              <tr key={index}>
                <td>{menuscript.menuscriptId}</td>
                <td>{menuscript.title}</td>
                <td>{menuscript.authorName}</td>
                <td>{menuscript.date}</td>
                <td>
                  <Link
                    to={`/availableArticles/${menuscript._id}`}
                    className='btn btn-sm btn-primary'
                    state={menuscript}
                  >
                    Preview
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableArticles;
