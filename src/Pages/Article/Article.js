import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Article = () => {
  const [selectedMenuscriptId, setSelectedMenuscriptId] = useState('');
  const [menuscript, setMenuscript] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMenuscript = location.state?.menuscript;
  const userRole = location.state?.userRole;
  console.log(location.pathname.split('/')[2]);

  const {
    _id,
    title,
    abstract,
    keywords,
    description,
    authorInfo,
    authorEmail,
    authorRole,
    authorSequence,
    dateTime,
    menuscriptId,
    paperStatus,
    decision,
    fundingSource
  } = selectedMenuscript || menuscript || {};

  useEffect(() => {
    if (location.state === null) {
      setSelectedMenuscriptId(location.pathname?.split('/')[2]);
    }
    fetch(
      `http://localhost:5000/article?articleId=${selectedMenuscriptId}`
    ).then((res) => res.json().then((data) => setMenuscript(data)));
  }, [selectedMenuscriptId, location.pathname, location.state]);

  const handleForwardMenuscript = (e) => {
    e.preventDefault();
    const reviewerEmail = e.target.reviewerEmail.value;

    fetch(`http://localhost:5000/forwardMenuscript?menuscriptId=${_id}`, {
      method: 'put',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ reviewerEmail })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success('Menuscript forwarded successfully');
          navigate('/availableArticles', { replace: true });
        } else {
          toast.error('Failed to forward menuscript');
        }
      });
  };
  const handleDeclineMenuscript = (e) => {
    e.preventDefault();
    const declinationMessage = e.target.declinationMessage.value;
  };

  return (
    <div>
      <h2 className='text-center text-3xl'>Menuscript {menuscriptId}</h2>
      <div className='card w-[95%] mx-auto bg-base-100 shadow-xl pb-4'>
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
              {authorInfo?.firstName} <br />
              <b>Last Name: </b>
              {authorInfo?.lastName} <br />
              <b>Email: </b>
              {authorEmail} <br />
              <b>Country: </b>
              {authorInfo?.country} <br />
              <b>Department: </b>
              {authorInfo?.department} <br />
              <b>Institute: </b>
              {authorInfo?.institute} <br />
            </div>
          </div>
          <p>
            <b>Author Role: </b>
            {authorRole}
          </p>
          <div>
            <b>Author Sequence:</b> <br />
            <div className='pl-6'>
              <table className='table w-1/2 table-zebra text-center'>
                <tr className='border'>
                  <th className='border'>Name</th>
                  <th>Email</th>
                </tr>
                {authorSequence?.map((author, index) => (
                  <tr className='border'>
                    <td className='border'>{author.authorName}</td>
                    <td>{author.authorEmail}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
          <p>
            <b>Funding Source: </b> {fundingSource}
          </p>
          <p>
            <b>Submission Date: </b> {dateTime}
          </p>
          <p>
            <b>Paper Status: </b> pending
          </p>
          <p>
            <b>Decision: </b> -
          </p>
        </div>
        {userRole === 'editor' ? (
          <div>
            <div className='flex w-full mb-2 px-2'>
              <div className='grid w-1/2 h-fit py-2 flex-grow card bg-base-300 rounded-box place-items-center'>
                <h4 className='text-center font-bold'>Forward</h4>
                <form onSubmit={(e) => handleForwardMenuscript(e)}>
                  <div className='form-control'>
                    <input
                      type='email'
                      placeholder='Reviewer Email'
                      className='input input-secondary hover:input-primary focus:input-primary focus:outline-0  min-h-10 h-10 py-1'
                      name='reviewerEmail'
                      required
                      autoComplete='off'
                    />
                  </div>
                  <button
                    type='submit'
                    className='btn btn-sm btn-primary w-full mt-1'
                  >
                    Forward Menuscript
                  </button>
                </form>
              </div>
              <div className='divider divider-horizontal'>OR</div>
              <div className='grid w-1/2 flex-grow card bg-base-300 rounded-box place-items-center py-1'>
                <h4 className='text-center font-bold'>Decline</h4>
                <form onSubmit={(e) => handleDeclineMenuscript(e)}>
                  <div className='form-control'>
                    <textarea
                      placeholder='Declination Message'
                      className='textarea textarea-secondary hover:textarea-primary focus:textarea-primary focus:outline-0 min-h-10 h-10 py-2'
                      name='declinationMessage'
                      required
                    />
                  </div>
                  <button
                    type='submit'
                    className='btn btn-sm btn-primary w-full mt-1'
                  >
                    Decline Menuscript
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        <Link to='/availableArticles' className='btn btn-primary w-1/2 mx-auto'>
          Return to Menuscripts
        </Link>
      </div>
    </div>
  );
};

export default Article;
