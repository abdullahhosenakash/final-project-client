import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    fetch(`http://localhost:5000/authorDrafts?authorEmail=${user.email}`)
      .then((res) => res.json())
      .then((data) => setDrafts(data));
  }, [user]);

  const handleDeleteDraft = (id) => {
    fetch(`http://localhost:5000/deleteDraft/${id}`, { method: 'delete' })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          console.log(data);
          const restDrafts = drafts.filter((draft) => draft._id !== id);
          setDrafts(restDrafts);
          toast.success('Draft deleted successfully');
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
              <th className='w-[20%]'>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {drafts.toReversed().map((draft, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{draft.title}</td>
                <td>{draft.dateTime}</td>
                <td>
                  <div className='flex gap-2'>
                    <Link
                      to={'/newMenuscript'}
                      className='btn btn-sm btn-primary w-1/2'
                      state={{ selectedDraft: draft }}
                    >
                      Edit
                    </Link>
                    <button
                      className='btn btn-sm btn-primary w-1/2'
                      onClick={() => handleDeleteDraft(draft._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drafts;