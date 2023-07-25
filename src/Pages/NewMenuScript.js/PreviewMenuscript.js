import React from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PreviewMenuscript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const newMenuscript = location?.state?.newMenuscript || {};
  console.log(newMenuscript);
  const id = location.state?.id || '';
  const {
    title,
    abstract,
    keywords,
    description,
    authorInfo,
    authorRole,
    authorSequence,
    fundingSource
  } = newMenuscript;
  const { firstName, lastName, authorEmail, country, department, institute } =
    authorInfo || {};
  const { authorInfo1, authorInfo2, authorInfo3 } = authorSequence || {};

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
    authorInfo1,
    authorInfo2,
    authorInfo3,
    fundingSource
  };

  const handleDraft = (e) => {
    e.preventDefault();
    const draftMenuscript = {
      ...selectedDraft,
      dateTime,
      authorEmail
    };

    const url =
      id === 'noMenuscript'
        ? 'http://localhost:5000/newDraftMenuscript'
        : `http://localhost:5000/updateDraftMenuscript/${id}`;

    fetch(url, {
      method: id === 'noMenuscript' ? 'post' : 'put',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(draftMenuscript)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success('Menuscript Saved Successfully');
          navigate('/drafts', { replace: true });
        }
      });
  };
  const handleMenuscriptUpload = (e) => {
    e.preventDefault();
    const newMenuscriptToBeUploaded = { ...newMenuscript, dateTime };
    // https://final-project-server-k11k.onrender.com
    fetch('http://localhost:5000/newMenuscript', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newMenuscriptToBeUploaded)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          console.log(id);
          if (id !== 'noMenuscript') {
            fetch(`http://localhost:5000/deleteDraft/${id}`, {
              method: 'delete'
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.acknowledged) {
                  toast.success('Menuscript uploaded successfully');
                  navigate('/availableArticles', { replace: true });
                }
              });
          } else {
            toast.success('Menuscript uploaded successfully');
            navigate('/availableArticles', { replace: true });
          }
        }
      });
  };

  return (
    <div>
      <h2 className='text-center text-3xl'>Preview Menuscript</h2>
      <div className='card w-[95%] mx-auto bg-base-100 shadow-xl'>
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
              <b>Author 1 : </b>
              {authorInfo1} <br />
              <b>Author 2: </b>
              {authorInfo2} <br />
              <b>Author 3: </b>
              {authorInfo3} <br />
            </div>
          </div>
          <p>
            <b>Funding Source: </b> {fundingSource}
          </p>
          <div className='form-control'>
            <div className='flex justify-around'>
              <Link
                to={'/newMenuscript'}
                className='btn btn-primary w-[32%]'
                state={{ selectedDraft: selectedDraft }}
              >
                Edit Again
              </Link>
              <button
                className='btn btn-primary w-[32%]'
                onClick={(e) => handleDraft(e)}
              >
                Save and Exit
              </button>

              <button
                className='btn btn-primary w-[32%]'
                onClick={(e) => handleMenuscriptUpload(e)}
              >
                Menuscript Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewMenuscript;
