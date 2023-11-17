import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loading from '../Utilities/Loading';
import { signOut } from 'firebase/auth';
import UpdateProfile from '../Utilities/UpdateProfile';

const Drafts = () => {
  UpdateProfile();
  const [drafts, setDrafts] = useState([]);
  const [user] = useAuthState(auth);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftDeleting, setDraftDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setDraftLoading(true);
    fetch(
      `https://final-project-server-k11k.onrender.com/authorDrafts?authorEmail=${user?.email}`,
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
        setDrafts(data);
        setDraftLoading(false);
      });
  }, [user, navigate]);

  const handleDeleteDraft = (id) => {
    setDraftDeleting(true);
    fetch(`https://final-project-server-k11k.onrender.com/deleteDraft/${id}`, {
      method: 'delete',
      headers: {
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
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
        if (data.acknowledged) {
          const restDrafts = drafts.filter((draft) => draft._id !== id);
          setDrafts(restDrafts);
          toast.success('Draft deleted successfully');
          setDraftDeleting(false);
        }
      });
  };

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Drafts</h2>
      <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
        <table className='table text-center'>
          {/* head */}
          <thead className='bg-gray-200 text-slate-900'>
            <tr>
              <th className='w-[10%]'>SL</th>
              <th>Title</th>
              <th className='w-[25%]'>Date Time</th>
              <th className='w-[27%]'>Action</th>
            </tr>
          </thead>
          <tbody>
            {draftLoading ? (
              <tr>
                <td colSpan={4}>
                  <Loading loadingStyles='loading-lg' />
                </td>
              </tr>
            ) : drafts.length ? (
              drafts?.toReversed().map((draft, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{draft.title}</td>
                  <td>{draft.dateTime}</td>
                  <td>
                    <div className='flex gap-2'>
                      <Link
                        to={'/newManuscript'}
                        className='btn btn-sm btn-primary w-1/2'
                        state={{ selectedDraft: draft }}
                      >
                        Edit
                      </Link>
                      <button
                        className='btn btn-sm btn-primary w-1/2'
                        onClick={() => handleDeleteDraft(draft._id)}
                      >
                        {draftDeleting ? (
                          <p className='flex items-center justify-center'>
                            <span className='pr-1'>Deleting</span> <Loading />
                          </p>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className='text-center text-xl hover:bg-gray-100'
                >
                  No draft available!{' '}
                  <Link
                    to='/newManuscript'
                    className='text-blue-600 hover:underline'
                  >
                    Click to add new manuscript
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drafts;
