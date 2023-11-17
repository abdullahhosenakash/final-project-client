import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-hot-toast';
import auth from '../../firebase.config';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../Utilities/Loading';
import useDateTime from '../../hooks/useDateTime';
import ReviewerTemplate from '../Utilities/ReviewerTemplate';
import send from '../../assets/send.png';
import useCurrentTime from '../../hooks/useCurrentTime';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UpdateProfile from '../Utilities/UpdateProfile';

const Manuscript = ({
  selectedManuscript,
  isModified = false,
  setIsModified = ''
}) => {
  UpdateProfile();
  const [user] = useAuthState(auth);
  const [userRole] = useUserRole(user?.email);
  const [reviewers, setReviewers] = useState([]);
  const [editorAction, setEditorAction] = useState('forward');
  const [chatPerson, setChatPerson] = useState('Author');
  const [loading, setLoading] = useState(false);
  const [dateTime] = useDateTime();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentTime] = useCurrentTime();
  const navigate = useNavigate();

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
    dateTime: submissionDateTime,
    manuscriptId,
    paperStatus,
    reviewers: rs,
    fundingSource,
    declinationMessage,
    decision,
    files
  } = selectedManuscript || {};
  const selectedReviewer = rs?.find((r) => r.reviewerEmail === user?.email);

  const [manuscriptMessage, setManuscriptMessage] = useState([]);
  const [stateChange, setStateChange] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const dateObject = new Date();

  const day = `${dateObject.getDate()}`;
  const month = `${dateObject.getMonth() + 1}`;
  const year = `${dateObject.getFullYear()}`;
  const date = `${day}/${month}/${year}`;

  const hours =
    dateObject.getHours() === 0
      ? '12'
      : dateObject.getHours() > 12
      ? `${dateObject.getHours() - 12}`
      : `${dateObject.getHours()}`;

  const minutes =
    dateObject.getMinutes() === 0
      ? '00'
      : dateObject.getMinutes() < 10
      ? `0${dateObject.getMinutes()}`
      : `${dateObject.getMinutes()}`;

  const AMPM = dateObject.getHours() < 12 ? 'AM' : 'PM';
  const time = `${hours}:${minutes} ${AMPM}`;
  const dateTimeForMessage = `${date} \u00A0\u00A0${time}`;

  const handleForwardManuscript = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(
      `https://final-project-server-k11k.onrender.com/forwardManuscript?objectId=${_id}`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ reviewers, dateTime })
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
          toast.success('Manuscript forwarded successfully');
          setLoading(false);
          setIsModified(!isModified);
        } else {
          toast.error('Failed to forward manuscript');
        }
      });
  };

  const handleDeclineManuscript = (e) => {
    e.preventDefault();
    setLoading(true);
    const declinationMessage = e.target.declinationMessage.value;
    fetch(
      `https://final-project-server-k11k.onrender.com/declineManuscript?objectId=${_id}`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ declinationMessage })
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
          toast.success('Manuscript decline successfully');
          setLoading(false);
          setIsModified(!isModified);
        } else {
          toast.error('Failed to decline manuscript');
        }
      });
  };

  const handleReviewerDecision = (e) => {
    e.preventDefault();
    setLoading(true);
    const reviewerDecision = e.target.reviewerDecision.value;
    const reviewerComment = e.target.reviewerComment.value;
    fetch(
      `https://final-project-server-k11k.onrender.com/reviewerDecision?objectId=${_id}`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          reviewerComment,
          reviewerDecision,
          reviewerEmail: user?.email
        })
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
          toast.success('Your decision sent successfully!');
          setLoading(false);
          setIsModified(!isModified);
        }
      });
  };

  const handleEditorFinalDecision = (e) => {
    e.preventDefault();
    setLoading(true);
    const editorFinalDecision = e.target.editorFinalDecision.value;
    const editorComment = e.target.editorComment.value;
    const newMassage = {
      sender: userRole,
      senderEmail: user?.email,
      senderName: '',
      message: editorComment,
      dateTimeForMessage
    };
    fetch(
      `https://final-project-server-k11k.onrender.com/finalUpdateManuscript?objectId=${_id}`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          decision: editorFinalDecision,
          newMassage
        })
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
          toast.success('Your decision saved successfully!');
          setLoading(false);
          setIsModified(!isModified);
        }
      });
  };

  const handleChatBox = (e) => {
    e.preventDefault();
    setSendingMessage(true);
    const message = e.target.message.value;
    let senderName;
    if (userRole === 'reviewer') {
      const reviewer = selectedManuscript?.reviewers?.find(
        (r) => r.reviewerEmail === user?.email
      );
      senderName = reviewer?.reviewerName;
    } else {
      senderName = '';
    }
    const newMassage = {
      sender: userRole,
      senderEmail: user?.email,
      senderName,
      message,
      dateTimeForMessage
    };
    fetch(
      `https://final-project-server-k11k.onrender.com/manuscriptChatBox?manuscriptId=${manuscriptId}${
        userRole === 'editor' ? `&target=${chatPerson}` : ''
      }`,
      {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newMassage)
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
          e.target.reset();
          setStateChange(!stateChange);
          setSendingMessage(false);
        }
      });
  };

  useEffect(() => {
    if (manuscriptId && userRole) {
      setMessageLoading(true);
      const url =
        userRole === 'editor'
          ? `https://final-project-server-k11k.onrender.com/manuscriptMessages?manuscriptId=${manuscriptId}&userRole=${userRole}&target=${chatPerson.toLowerCase()}`
          : `https://final-project-server-k11k.onrender.com/manuscriptMessages?manuscriptId=${manuscriptId}&userRole=${userRole}`;
      fetch(url, {
        method: 'get',
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
          setManuscriptMessage(data);
          setMessageLoading(false);
        });
    }
  }, [manuscriptId, userRole, stateChange, chatPerson, navigate]);

  const chatBox = () => (
    <>
      <p className='text-xl text-center'>Chat Box</p>
      {userRole === 'editor' && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='flex gap-3 justify-center items-center'>
            <span className='text-lg'>Chat with:</span>
            <label className='label cursor-pointer'>
              <input
                type='radio'
                name='chatPerson'
                className='radio'
                value='Author'
                defaultChecked
                onChange={(e) => setChatPerson(e.target.value)}
              />
              <span className='label-text pl-1'>Author</span>
            </label>
            <label className='label cursor-pointer'>
              <input
                type='radio'
                name='chatPerson'
                className='radio'
                value='Reviewer'
                onChange={(e) => setChatPerson(e.target.value)}
              />
              <span className='label-text pl-1'>Reviewer</span>
            </label>
          </div>
        </form>
      )}
      <div
        className={`border border-secondary rounded-lg w-full max-w-xl h-96 mx-auto bg-base-300 overflow-y-scroll flex flex-col-reverse relative ${
          decision === 'Accepted' && 'opacity-60 cursor-not-allowed'
        }`}
      >
        <form onSubmit={(e) => handleChatBox(e)}>
          {messageLoading ? (
            <Loading loadingStyles='loading-lg block mx-auto mb-[8rem]' />
          ) : manuscriptMessage.length ? (
            manuscriptMessage.map((message, index) => (
              <div
                key={index}
                className={`chat ${
                  message.senderEmail === user?.email
                    ? 'chat-end'
                    : 'chat-start'
                }`}
              >
                <div className='chat-header'>
                  {message.senderEmail !== user?.email && (
                    <>
                      {message.senderName}
                      <sup>
                        <p className='first-letter:uppercase inline-block'>
                          {message.sender}
                        </p>
                      </sup>
                    </>
                  )}
                  <time className='text-xs opacity-60 pl-1'>
                    {message.dateTimeForMessage}
                  </time>
                </div>
                <div
                  className={`chat-bubble !max-w-sm text-justify ${
                    message.senderEmail !== user?.email &&
                    'bg-gray-300 text-black'
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))
          ) : (
            <div className='text-center mb-[12rem] text-lg text-slate-600'>
              start your conversation now!
            </div>
          )}

          <div className='flex items-center  bg-base-100'>
            <textarea
              name='message'
              required
              className='textarea focus:outline-0 rounded-lg m-2 border-0 w-full bg-base-200 resize-none px-2 disabled:opacity-70'
              placeholder='Type here a message...'
              disabled={sendingMessage || decision === 'Accepted'}
            />
            {sendingMessage && (
              <Loading loadingStyles='absolute left-[42%] bottom-12' />
            )}
            <button
              className='mr-2 disabled:opacity-30'
              disabled={sendingMessage || decision === 'Accepted'}
            >
              <img
                src={send}
                alt=''
                disabled={sendingMessage || decision === 'Accepted'}
                className='btn w-14 border rounded-full hover:border-primary p-2 hover:bg-slate-200'
              />
            </button>
          </div>
        </form>
      </div>
      <p
        className={
          decision === 'Accepted'
            ? 'text-center text-lg text-red-500'
            : 'hidden'
        }
      >
        The manuscript is accepted and the chatbox is disabled
      </p>
    </>
  );

  return (
    <dialog id='my_modal_1' className='modal'>
      <div className='modal-box max-w-3xl border-[16px] border-white pr-4'>
        <h2 className='text-center text-3xl'>Manuscript {manuscriptId}</h2>
        <div className='card w-[95%] mx-auto bg-base-100 shadow-xl pb-4 text-start'>
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
            <p>
              <b>Draft File: </b>{' '}
              <a
                href={files?.draftFileUrl}
                target='_blank'
                rel='noreferrer'
                className='text-blue-600 hover:underline'
              >
                Click to Open
              </a>
            </p>
            {userRole !== 'reviewer' && (
              <p>
                <b>Cover Letter: </b>{' '}
                <a
                  href={files?.coverLetterUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  Click to Open
                </a>
              </p>
            )}
            <p>
              <b>Images: </b>
            </p>
            <div className='grid grid-cols-1 gap-2'>
              {files?.imageUrls?.map((image, index) => (
                <img
                  src={image}
                  alt='manuscript images'
                  key={index}
                  className='border border-primary'
                />
              ))}
            </div>

            {userRole !== 'reviewer' && (
              <>
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
                    <table className='table w-1/2 text-center'>
                      <thead>
                        <tr className='border border-primary'>
                          <th className='border border-primary text-black'>
                            Name
                          </th>
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
                <p>
                  <b>Funding Source: </b> {fundingSource}
                </p>
              </>
            )}
            <p>
              <b>Submission Date: </b> {submissionDateTime}
            </p>

            {userRole !== 'reviewer' && (
              <p>
                <b>Paper Status: </b> {paperStatus}{' '}
                {selectedManuscript?.revised ? '(Reuploaded)' : ''}
              </p>
            )}
            <p>
              <b>Decision: </b>{' '}
              {userRole !== 'reviewer'
                ? selectedManuscript?.decision
                : selectedReviewer?.reviewerDecision}
            </p>

            {userRole !== 'reviewer' && declinationMessage && (
              <div className='border-2 border-dashed rounded-xl border-red-600 w-10/12 mx-auto mb-2'>
                <p className='text-center text-xl underline'>
                  Declination Message
                </p>
                <p className='p-2 text-justify'>{declinationMessage}</p>
              </div>
            )}

            {userRole === 'editor' && paperStatus !== 'Pending' && (
              <div>
                <b>Reviewers:</b> <br />
                <div className='pl-6'>
                  <table className='table text-center'>
                    <thead>
                      <tr className='border border-primary'>
                        <th className='border border-primary text-black'>
                          Name
                        </th>
                        <th className='border border-primary text-black'>
                          Email
                        </th>
                        <th className='text-black'>Reviewer Decision</th>
                        <th className='border border-primary text-black'>
                          Comment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedManuscript?.reviewers?.map((reviewer, index) => (
                        <tr className='border border-primary' key={index}>
                          <td className='border border-primary'>
                            {reviewer.reviewerName}
                          </td>
                          <td className='border border-primary'>
                            {reviewer.reviewerEmail}
                          </td>
                          <td className='border border-primary'>
                            {reviewer.reviewerDecision}
                          </td>
                          <td>{reviewer.reviewerComment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {userRole === 'editor' && paperStatus === 'Pending' && (
            <div className='w-3/4 mx-auto border-2 border-primary border-dashed'>
              <p className='text-center text-xl underline'>Editor Action</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className='flex gap-3 justify-center'>
                  <label className='label cursor-pointer'>
                    <input
                      type='radio'
                      name='editorAction'
                      className='radio'
                      value='forward'
                      defaultChecked
                      onChange={(e) => setEditorAction(e.target.value)}
                    />
                    <span className='label-text pl-1'>Forward</span>
                  </label>
                  <label className='label cursor-pointer'>
                    <input
                      type='radio'
                      name='editorAction'
                      className='radio'
                      value='decline'
                      onChange={(e) => setEditorAction(e.target.value)}
                    />
                    <span className='label-text pl-1'>Decline</span>
                  </label>
                </div>
              </form>

              <div className='mx-auto p-2'>
                {editorAction === 'forward' ? (
                  <div>
                    {/* -----------------forward section------------------- */}
                    {/* ----------number of reviewers----------- */}
                    <div className='form-control my-2'>
                      <div className='relative'>
                        <select
                          id='numberOfReviewer'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white'
                          name='numberOfReviewer'
                          onChange={(e) => {
                            const numberOfReviewers = parseInt(e.target.value);
                            switch (numberOfReviewers) {
                              case 1:
                                setReviewers([
                                  { reviewerName: '', reviewerEmail: '' }
                                ]);
                                break;
                              case 2:
                                setReviewers([
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' }
                                ]);
                                break;
                              case 3:
                                setReviewers([
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' }
                                ]);
                                break;
                              case 4:
                                setReviewers([
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' }
                                ]);
                                break;
                              case 5:
                                setReviewers([
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' },
                                  { reviewerName: '', reviewerEmail: '' }
                                ]);
                                break;
                              default:
                                setReviewers([]);
                            }
                          }}
                          required
                        >
                          <option value=''>
                            - - Select the number of reviewer - -
                          </option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>
                          <option value='5'>5</option>
                        </select>
                        <label
                          htmlFor='numberOfReviewer'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          No. of Reviewers
                        </label>
                      </div>
                    </div>
                    <form onSubmit={(e) => handleForwardManuscript(e)}>
                      <div className='form-control mt-2'>
                        {reviewers.map((reviewer, index) => (
                          <ReviewerTemplate
                            key={index}
                            index={index}
                            reviewer={reviewer}
                            reviewers={reviewers}
                            setReviewers={setReviewers}
                          />
                        ))}
                        <button
                          type='submit'
                          className='flex btn btn-sm btn-primary w-1/2 mx-auto mt-1 disabled:bg-slate-500'
                          disabled={loading}
                        >
                          Forward Manuscript {loading && <Loading />}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleDeclineManuscript(e)}>
                    <div className='form-control'>
                      <div className='relative'>
                        <textarea
                          id='declinationMessage'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          name='declinationMessage'
                          required
                          autoComplete='off'
                        />
                        <label
                          htmlFor='declinationMessage'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Declination Message
                        </label>
                      </div>
                    </div>
                    <button
                      type='submit'
                      className='btn btn-sm btn-primary block w-1/2 mx-auto mt-1'
                    >
                      Decline Manuscript
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {userRole === 'reviewer' &&
            selectedReviewer?.reviewerDecision &&
            chatBox()}

          {userRole !== 'reviewer' &&
            (paperStatus === 'Forwarded' || paperStatus === 'Reviewed') &&
            chatBox()}

          {userRole === 'reviewer' && !selectedReviewer?.reviewerDecision && (
            <div className='w-3/4 mx-auto border-2 rounded-xl border-primary border-dashed'>
              <p className='text-center text-xl underline'>Reviewer Action</p>
              <form onSubmit={(e) => handleReviewerDecision(e)}>
                <div className='form-control my-2 mx-2'>
                  <div className='relative'>
                    <select
                      id='reviewerDecision'
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white'
                      name='reviewerDecision'
                      disabled={selectedReviewer?.reviewerDecision}
                      required
                    >
                      <option value=''>- - Your Decision - -</option>
                      <option value='Accepted'>Accepted</option>
                      <option value='Need Revised'>Need Revised</option>
                    </select>
                    <label
                      htmlFor='reviewerDecision'
                      className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                    >
                      Decision
                    </label>
                  </div>
                </div>
                <div className='form-control mb-2 mx-2'>
                  <div className='relative'>
                    <textarea
                      id='reviewerComment'
                      name='reviewerComment'
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                      placeholder=''
                      disabled={selectedReviewer?.reviewerDecision || loading}
                      required
                      autoComplete='off'
                    />
                    <label
                      htmlFor='reviewerComment'
                      className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                    >
                      Comment
                    </label>
                  </div>
                </div>
                <div className='form-control'>
                  <button
                    type='submit'
                    className='btn btn-sm btn-primary flex w-1/2 mx-auto mb-2 disabled:bg-slate-500'
                    disabled={selectedReviewer?.reviewerDecision || loading}
                  >
                    {loading ? (
                      <>
                        Sending Your Decision <Loading />
                      </>
                    ) : (
                      'Send Your Decision'
                    )}
                  </button>
                  {selectedReviewer?.reviewerDecision ? (
                    <p className='rounded py-2 px-4 mb-2 text-green-900 bg-slate-200 w-fit mx-auto'>
                      You already reviewed this
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </form>
            </div>
          )}

          {userRole === 'editor' && paperStatus === 'Forwarded' && (
            <div
              className={
                decision === 'Accepted' && 'opacity-60 cursor-not-allowed'
              }
            >
              <div className='divider w-[90%] mx-auto'>OR</div>
              {/* editor final decision */}
              <div className='w-3/4 mx-auto border-2 rounded-xl border-primary border-dashed'>
                <p className='text-center text-xl underline'>
                  Editor Final Decision
                </p>
                <form onSubmit={(e) => handleEditorFinalDecision(e)}>
                  <div className='form-control my-2 mx-2'>
                    <div className='relative'>
                      <select
                        id='editorFinalDecision'
                        className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white disabled:cursor-not-allowed disabled:hover:input-secondary'
                        name='editorFinalDecision'
                        disabled={decision === 'Accepted' || loading}
                        required
                      >
                        <option value=''>- - Your Decision - -</option>
                        <option value='Accepted'>Accepted</option>
                        <option value='Need Revised'>Need Revised</option>
                      </select>
                      <label
                        htmlFor='editorFinalDecision'
                        className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                      >
                        Decision
                      </label>
                    </div>
                  </div>
                  <div className='form-control mb-2 mx-2'>
                    <div className='relative'>
                      <textarea
                        id='editorComment'
                        name='editorComment'
                        className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:cursor-not-allowed disabled:hover:input-secondary'
                        placeholder=''
                        disabled={decision === 'Accepted' || loading}
                        required
                        autoComplete='off'
                      />
                      <label
                        htmlFor='editorComment'
                        className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                      >
                        Comment
                      </label>
                    </div>
                  </div>
                  <div className='form-control'>
                    <button
                      type='submit'
                      className='btn btn-sm btn-primary flex w-1/2 mx-auto mb-2 disabled:bg-slate-500'
                      disabled={decision === 'Accepted' || loading}
                    >
                      {loading ? (
                        <>
                          Sending Your Decision <Loading />
                        </>
                      ) : (
                        'Send Your Decision'
                      )}
                    </button>
                    {decision === 'Accepted' ? (
                      <p className='rounded py-2 px-4 mb-2 text-green-900 bg-slate-200 w-fit mx-auto'>
                        Manuscript Accepted
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <form method='dialog'>
          <button className='btn btn-primary block w-1/2 mx-auto mt-8'>
            Close Manuscript
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default Manuscript;
