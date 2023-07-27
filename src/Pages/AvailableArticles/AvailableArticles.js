import React, { useEffect, useState } from 'react';
import './AvailableArticles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { Link } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';
import downloadIcon from '../../../src/assets/download-icon.png';

const AvailableArticles = () => {
  const [menuscripts, setMenuscripts] = useState([]);
  const [user] = useAuthState(auth);
  const [userRole] = useUserRole(user?.email);

  useEffect(() => {
    const authorLink = `http://localhost:5000/authorArticles?authorEmail=${user?.email}`;
    const editorLink =
      'https://final-project-server-k11k.onrender.com/articles';
    fetch(userRole === 'author' ? authorLink : editorLink)
      .then((res) => res.json())
      .then((data) => setMenuscripts(data));
  }, [user, userRole]);

  const handleDownloadMenuscript = (menuscriptId) => {
    //
  };

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Menuscripts</h2>
      <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
        <table className='table text-center'>
          {/* head */}
          <thead className='bg-gray-200 text-slate-900'>
            <tr>
              <th className='w-[12%]'>Paper ID</th>
              <th className='w-[10%]'>Co-Author</th>
              <th>Title</th>
              <th className='w-[20%]'>Submission Date</th>
              <th className='w-[10%]'>Paper Status</th>
              <th className='w-[15%]'>Decision</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {menuscripts?.toReversed().map((menuscript, index) => (
              <tr key={index}>
                <td className='flex gap-1 items-center justify-center'>
                  <span>{menuscript?.menuscriptId}</span>
                  <img
                    src={downloadIcon}
                    alt='Download Icon'
                    className='w-5 cursor-pointer'
                    onClick={() =>
                      handleDownloadMenuscript(menuscript?.menuscriptId)
                    }
                  />
                </td>
                <td>
                  {menuscript?.authorSequence?.authorInfo1},{' '}
                  {menuscript?.authorSequence?.authorInfo2},{' '}
                  {menuscript?.authorSequence?.authorInfo3}
                </td>
                <td>{menuscript?.title}</td>
                <td>{menuscript?.dateTime}</td>
                <td>pending</td>
                <td>{menuscript?.decision}-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableArticles;
