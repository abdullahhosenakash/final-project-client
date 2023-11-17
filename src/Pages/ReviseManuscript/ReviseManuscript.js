import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthorTemplate from '../Utilities/AuthorTemplate';
import Loading from '../Utilities/Loading';
import useDateTime from '../../hooks/useDateTime';
import { signOut } from 'firebase/auth';
import UpdateProfile from '../Utilities/UpdateProfile';

const ReviseManuscript = ({
  selectedManuscriptForRevising,
  authorSequence,
  isModified = false,
  setIsModified = ''
}) => {
  UpdateProfile();
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');
  const [institute, setInstitute] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [fundingSource, setFundingSource] = useState('');
  const [authors, setAuthors] = useState(authorSequence);
  const navigate = useNavigate();

  const [dateTime] = useDateTime();

  const handleReuploadManuscript = (e) => {
    e.preventDefault();
    if (!keywordError) {
      let authorError = '';
      setUploading(true);
      const newAuthorList = authors?.map((author) => {
        if (author.authorEmail.toLowerCase() === user?.email) {
          authorError = 'Your email and any other author email can not be same';
          return {};
        } else {
          const newAuthor = {
            authorName: author.authorName,
            authorEmail: author.authorEmail.toLowerCase()
          };
          return newAuthor;
        }
      });

      if (errorMessage || authorError) {
        authorError && setErrorMessage(authorError);
        setUploading(false);
        return;
      }
      const modifiedManuscript = {
        title,
        abstract,
        keywords,
        description,
        authorInfo: {
          firstName,
          lastName,
          country,
          department,
          institute
        },
        authorEmail: user?.email,
        authorRole,
        authorSequence: newAuthorList,
        fundingSource,
        dateTime,
        paperStatus: 'Pending',
        decision: '-',
        revised: true
      };
      const {
        firstName: fName,
        lastName: lName,
        country: c,
        department: d,
        institute: i,
        ...restPropertiesOfSelectedManuscript
      } = selectedManuscriptForRevising;
      const updatedManuscript = Object.assign(
        restPropertiesOfSelectedManuscript,
        modifiedManuscript
      );

      fetch(
        'https://final-project-server-k11k.onrender.com/updateRevisedManuscript',
        {
          method: 'put',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(updatedManuscript)
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
            toast.success('Manuscript reuploaded successfully');
            setUploading(false);
            setIsModified(!isModified);
          }
        });
    }
  };

  useEffect(() => {
    setAuthors(authorSequence);
    setTitle(selectedManuscriptForRevising.title);
    setAbstract(selectedManuscriptForRevising.abstract);
    setKeywords(selectedManuscriptForRevising.keywords);
    setDescription(selectedManuscriptForRevising.description);
    setFirstName(selectedManuscriptForRevising.firstName);
    setLastName(selectedManuscriptForRevising.lastName);
    setCountry(selectedManuscriptForRevising.country);
    setDepartment(selectedManuscriptForRevising.department);
    setInstitute(selectedManuscriptForRevising.institute);
    setAuthorRole(selectedManuscriptForRevising.authorRole);
    setFundingSource(selectedManuscriptForRevising.fundingSource);
  }, [authorSequence, selectedManuscriptForRevising]);

  return (
    <dialog id='my_modal_4' className='modal'>
      <div className='modal-box max-w-2xl border-[16px] border-white pr-4'>
        {selectedManuscriptForRevising.manuscriptId ? (
          <>
            <div className='pb-4'>
              <h2 className='text-center text-3xl pt-2'>
                Revise Manuscript: {selectedManuscriptForRevising?.manuscriptId}
              </h2>
              <form onSubmit={(e) => handleReuploadManuscript(e)}>
                <div className='card mx-auto w-full max-w-3xl shadow-2xl bg-base-100'>
                  <div className='card-body'>
                    {/* -----------------Title----------------- */}
                    <div className='form-control'>
                      <div className='relative'>
                        <input
                          type='text'
                          id='title'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                          defaultValue={selectedManuscriptForRevising.title}
                          required
                          autoComplete='off'
                        />
                        <label
                          htmlFor='title'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Title
                        </label>
                      </div>
                    </div>
                    {/* --------------------Abstract--------------- */}
                    <div className='form-control'>
                      <div className='relative'>
                        <textarea
                          id='abstract'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          onChange={(e) => {
                            setAbstract(e.target.value);
                          }}
                          defaultValue={selectedManuscriptForRevising.abstract}
                          required
                          autoComplete='off'
                        />
                        <label
                          htmlFor='abstract'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Abstract
                        </label>
                      </div>
                    </div>
                    {/* ------------------------Keywords----------------- */}
                    <div className='form-control'>
                      <div className='relative'>
                        <textarea
                          id='keywords'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          required
                          onChange={(e) => {
                            const inputtedKeywords = e.target.value.split(',');
                            if (inputtedKeywords.length < 5) {
                              setKeywordError('Add at least five keywords');
                            } else {
                              setKeywords(e.target.value);
                              setKeywordError('');
                            }
                          }}
                          defaultValue={selectedManuscriptForRevising.keywords}
                          autoComplete='off'
                        />
                        <label
                          htmlFor='keywords'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Keywords (Separated by Comma)
                        </label>
                      </div>
                      <span className='text-sm text-red-700'>
                        {keywordError}
                      </span>
                    </div>
                    {/* -----------------Description---------------------- */}
                    <div className='form-control'>
                      <div className='relative'>
                        <textarea
                          id='description'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                          defaultValue={
                            selectedManuscriptForRevising.description
                          }
                          required
                          autoComplete='off'
                        />
                        <label
                          htmlFor='description'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Description
                        </label>
                      </div>
                    </div>
                    {/* --------------------Author Info---------------------- */}
                    <div className='border-2 border-dashed rounded p-2'>
                      <p className='mb-1'>Author Info</p>
                      <div className='flex justify-between mb-2'>
                        {/* --------------------first name-------------------- */}
                        <div className='form-control w-[49%]'>
                          <div className='relative'>
                            <input
                              type='text'
                              id='firstName'
                              className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                              placeholder=''
                              name='firstName'
                              onChange={(e) => {
                                setFirstName(e.target.value);
                              }}
                              defaultValue={
                                selectedManuscriptForRevising.firstName
                              }
                              required
                              autoComplete='off'
                            />
                            <label
                              htmlFor='firstName'
                              className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                            >
                              First Name
                            </label>
                          </div>
                        </div>
                        {/* -----------------------last name------------------ */}
                        <div className='form-control w-[49%]'>
                          <div className='relative'>
                            <input
                              type='text'
                              id='lastName'
                              className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                              placeholder=''
                              name='lastName'
                              onChange={(e) => {
                                setLastName(e.target.value);
                              }}
                              defaultValue={
                                selectedManuscriptForRevising.lastName
                              }
                              required
                              autoComplete='off'
                            />
                            <label
                              htmlFor='lastName'
                              className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                            >
                              Last Name
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* --------------------email-------------------- */}
                      <div className='form-control'>
                        <div className='relative'>
                          <input
                            type='email'
                            id='email'
                            className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                            placeholder=''
                            disabled
                            defaultValue={user.email}
                            autoComplete='off'
                          />
                          <label
                            htmlFor='email'
                            className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                          >
                            Email
                          </label>
                        </div>
                      </div>
                      {/* --------------------country-------------------- */}
                      <div className='form-control mt-2'>
                        <div className='relative'>
                          <input
                            type='text'
                            id='country'
                            className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                            placeholder=''
                            name='country'
                            onChange={(e) => {
                              setCountry(e.target.value);
                            }}
                            defaultValue={selectedManuscriptForRevising.country}
                            required
                            autoComplete='off'
                          />
                          <label
                            htmlFor='country'
                            className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                          >
                            Country
                          </label>
                        </div>
                      </div>
                      <p className='pt-2 pl-1'>Affiliation</p>
                      {/* ---------------------Department--------------------- */}
                      <div className='form-control mt-1'>
                        <div className='relative'>
                          <input
                            type='text'
                            id='department'
                            className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                            placeholder=''
                            name='department'
                            onChange={(e) => {
                              setDepartment(e.target.value);
                            }}
                            defaultValue={
                              selectedManuscriptForRevising.department
                            }
                            required
                            autoComplete='off'
                          />
                          <label
                            htmlFor='department'
                            className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                          >
                            Department
                          </label>
                        </div>
                      </div>
                      {/* -------------------institute---------------------- */}
                      <div className='form-control mt-2'>
                        <div className='relative'>
                          <input
                            type='text'
                            id='institute'
                            className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                            placeholder=''
                            name='institute'
                            onChange={(e) => {
                              setInstitute(e.target.value);
                            }}
                            defaultValue={
                              selectedManuscriptForRevising.institute
                            }
                            required
                            autoComplete='off'
                          />
                          <label
                            htmlFor='institute'
                            className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                          >
                            Institute
                          </label>
                        </div>
                      </div>
                      {/* ---------------------author role-------------------------- */}
                      <div className='form-control mt-2'>
                        <div className='relative'>
                          <select
                            id='authorRole'
                            className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white'
                            name='authorRole'
                            onChange={(e) => {
                              setAuthorRole(e.target.value);
                            }}
                            defaultValue={
                              selectedManuscriptForRevising.authorRole
                            }
                            required
                          >
                            <option value=''>- - Select Author Role - -</option>
                            <option value='Co-Author'>Co-Author</option>
                            <option value='Corresponding Author'>
                              Corresponding Author
                            </option>
                          </select>
                          <label
                            htmlFor='authorRole'
                            className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                          >
                            Author Role
                          </label>
                        </div>
                      </div>
                      {/* ------------------------author sequence---------------------- */}
                      <div className='form-control'>
                        <label className='label py-1'>
                          <span className='label-text'>Author Sequence</span>
                        </label>
                        {/* ---------------------number of authors---------------------- */}
                        <div className='form-control my-2'>
                          <div className='relative'>
                            <select
                              id='numberOfAuthors'
                              className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white'
                              name='authorRole'
                              value={authors.length}
                              onChange={(e) => {
                                const numberOfAuthors = parseInt(
                                  e.target.value
                                );
                                switch (numberOfAuthors) {
                                  case 1:
                                    setAuthors([
                                      { authorName: '', authorEmail: '' }
                                    ]);
                                    break;
                                  case 2:
                                    setAuthors([
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' }
                                    ]);
                                    break;
                                  case 3:
                                    setAuthors([
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' }
                                    ]);
                                    break;
                                  case 4:
                                    setAuthors([
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' }
                                    ]);
                                    break;
                                  case 5:
                                    setAuthors([
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' },
                                      { authorName: '', authorEmail: '' }
                                    ]);
                                    break;
                                  default:
                                    setAuthors([]);
                                }
                              }}
                              required
                            >
                              <option value=''>
                                - - Select the number of authors - -
                              </option>
                              <option value='1'>1</option>
                              <option value='2'>2</option>
                              <option value='3'>3</option>
                              <option value='4'>4</option>
                              <option value='5'>5</option>
                            </select>
                            <label
                              htmlFor='numberOfAuthors'
                              className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                            >
                              No. of Authors
                            </label>
                          </div>
                        </div>
                        <div>
                          {authors.map((author, index) => (
                            <AuthorTemplate
                              key={index}
                              index={index}
                              authorsLength={authors.length}
                              setAuthors={setAuthors}
                              authors={authors}
                              author={author}
                              setErrorMessage={setErrorMessage}
                              userEmail={user?.email}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* ----------------------funding source---------------------- */}
                    <div className='form-control'>
                      <div className='relative'>
                        <input
                          type='text'
                          id='fundingSource'
                          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                          placeholder=''
                          name='fundingSource'
                          onChange={(e) => setFundingSource(e.target.value)}
                          defaultValue={
                            selectedManuscriptForRevising.fundingSource
                          }
                          autoComplete='off'
                        />
                        <label
                          htmlFor='fundingSource'
                          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                        >
                          Funding Source (If any)
                        </label>
                      </div>
                      <span className='text-red-700 text-center'>
                        {keywordError}
                      </span>
                    </div>

                    {/* ----------------------actions---------------------- */}
                    <div className='form-control'>
                      <p className='text-sm text-center text-red-700 m-0 py-2'>
                        {errorMessage}
                      </p>
                      <button
                        type='submit'
                        className='btn btn-sm btn-primary disabled:bg-slate-500'
                        disabled={uploading}
                      >
                        Reupload Manuscript {uploading ? <Loading /> : ''}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <form method='dialog'>
              <button className='btn btn-sm btn-primary block w-1/2 mx-auto'>
                Discard Revision
              </button>
            </form>
          </>
        ) : (
          ''
        )}
      </div>
    </dialog>
  );
};

export default ReviseManuscript;
