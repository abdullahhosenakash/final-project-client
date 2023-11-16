import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Utilities/Loading';
import { signOut } from 'firebase/auth';
import auth from '../../firebase.config';

const PreviewManuscript = () => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const newManuscript = location?.state?.newManuscript;
  const id = location.state?.id || '';
  const {
    title,
    abstract,
    keywords,
    description,
    authorInfo,
    authorEmail,
    authorRole,
    authorSequence,
    fundingSource
  } = newManuscript || {};
  const { firstName, lastName, country, department, institute } =
    authorInfo || {};

  const dateArray = new Date().toLocaleString().split(',');
  const date =
    dateArray[0].split('/')[1] +
    '/' +
    dateArray[0].split('/')[0] +
    '/' +
    dateArray[0].split('/')[2];
  const dateTime = date + ',' + dateArray[1];
  const selectedDraft = {
    title,
    abstract,
    keywords,
    description,
    firstName,
    lastName,
    country,
    department,
    institute,
    authorRole,
    authorSequence,
    fundingSource
  };

  const handleDraft = (e) => {
    e.preventDefault();
    setSaving(true);
    const draftManuscript = {
      ...selectedDraft,
      dateTime,
      authorEmail
    };

    const url =
      id === 'noManuscript'
        ? 'https://final-project-server-k11k.onrender.com/newDraftManuscript'
        : `https://final-project-server-k11k.onrender.com/updateDraftManuscript/${id}`;

    fetch(url, {
      method: id === 'noManuscript' ? 'post' : 'put',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(draftManuscript)
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
          toast.success('Manuscript Saved Successfully');
          setSaving(false);
          navigate('/drafts', { replace: true });
        }
      });
  };

  const handleManuscriptUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    const newManuscriptToBeUploaded = { ...newManuscript, dateTime };
    fetch('https://final-project-server-k11k.onrender.com/newManuscript', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(newManuscriptToBeUploaded)
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
          if (id !== 'noManuscript') {
            fetch(
              `https://final-project-server-k11k.onrender.com/deleteDraft/${id}`,
              {
                method: 'delete',
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
                if (data.acknowledged) {
                  toast.success('Manuscript uploaded successfully');
                  setUploading(false);
                  navigate('/manuscriptsAsCoAuthor', { replace: true });
                }
              });
          } else {
            toast.success('Manuscript uploaded successfully');
            setUploading(false);
            navigate('/manuscriptsAsCoAuthor', { replace: true });
          }
        }
      });
  };

  return (
    <div>
      <h2 className='text-center text-3xl'>Preview Manuscript</h2>
      <div className='card w-[95%] mx-auto bg-base-100 shadow-xl mb-4'>
        <div className='card-body'>
          <h2 className='card-title'>
            Title: <span className='font-normal'>{title}</span>
          </h2>
          <p>
            <b>Abstract:</b> {abstract}
          </p>
          <p>
            <b>Keywords:</b> {keywords}
          </p>
          <p>
            <b>Description:</b> {description}
          </p>
          <div>
            <b>Author Info:</b> <br />
            <div className='pl-6'>
              <b>First Name: </b>
              {firstName} <br />
              <b>Last Name: </b>
              {lastName} <br />
              <b>Email: </b>
              {authorEmail} <br />
              <b>Country: </b>
              {country} <br />
              <b>Department: </b>
              {department} <br />
              <b>Institute: </b>
              {institute} <br />
            </div>
          </div>
          <p>
            <b>Author Role: </b>
            {authorRole}
          </p>
          <div>
            <b>Author Sequence:</b> <br />
            <div className='pl-6'>
              <table className='table w-1/2 table- text-center'>
                <thead>
                  <tr className='border border-primary'>
                    <th className='border border-primary text-black'>Name</th>
                    <th className='text-black'>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {authorSequence?.map((author, index) => (
                    <tr className='border border-primary' key={index}>
                      <td className='border border-primary'>
                        {author.authorName}
                      </td>
                      <td>{author.authorEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className='mb-2'>
            <b>Funding Source: </b> {fundingSource}
          </p>
          <div className='form-control'>
            <div className='flex justify-around'>
              <Link
                to={'/newManuscript'}
                className='btn btn-primary w-[32%]'
                state={{ selectedDraft: selectedDraft }}
              >
                Edit Again
              </Link>
              <button
                className='btn btn-primary w-[32%]'
                disabled={saving}
                onClick={(e) => handleDraft(e)}
              >
                Save and Exit {saving ? <Loading /> : ''}
              </button>

              <button
                className='btn btn-primary w-[32%]'
                onClick={(e) => handleManuscriptUpload(e)}
                disabled={uploading}
              >
                Manuscript Upload {uploading ? <Loading /> : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewManuscript;
