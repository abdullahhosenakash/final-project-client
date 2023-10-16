import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthorTemplate from '../Utilities/AuthorTemplate';

const NewMenuScript = () => {
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [draftError, setDraftError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [keywordError, setKeywordError] = useState('');

  const location = useLocation();
  const selectedDraft = location.state?.selectedDraft || {};
  const [title, setTitle] = useState(selectedDraft.title || '');
  const [abstract, setAbstract] = useState(selectedDraft.abstract || '');
  const [keywords, setKeywords] = useState(selectedDraft.keywords || '');
  const [description, setDescription] = useState(
    selectedDraft.description || ''
  );
  const [firstName, setFirstName] = useState(selectedDraft.firstName || '');
  const [lastName, setLastName] = useState(selectedDraft.lastName || '');
  const [country, setCountry] = useState(selectedDraft.country || '');
  const [department, setDepartment] = useState(selectedDraft.department || '');
  const [institute, setInstitute] = useState(selectedDraft.institute || '');
  const [authorRole, setAuthorRole] = useState(selectedDraft.authorRole || '');
  const [fundingSource, setFundingSource] = useState(
    selectedDraft.fundingSource || 'not applicable'
  );
  const [authors, setAuthors] = useState(selectedDraft.authorSequence || []);
  const navigate = useNavigate();

  const id = selectedDraft._id || 'newMenuscript';

  const dateArray = new Date().toLocaleString().split(',');
  const date =
    dateArray[0].split('/')[1] +
    '/' +
    dateArray[0].split('/')[0] +
    '/' +
    dateArray[0].split('/')[2];
  const dateTime = date + ',' + dateArray[1];

  const handleDraft = (e) => {
    e.preventDefault();
    if (!title) {
      setDraftError('Your draft must have a title!');
    } else {
      const draftMenuscript = {
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
        authors,
        fundingSource,
        dateTime,
        authorEmail: user.email
      };

      const url =
        id === 'newMenuscript'
          ? 'http://localhost:5000/newDraftMenuscript'
          : `http://localhost:5000/updateDraftMenuscript/${id}`;

      fetch(url, {
        method: id === 'newMenuscript' ? 'post' : 'put',
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
    }
  };

  const handlePostArticle = (e) => {
    e.preventDefault();
    if (!keywordError) {
      const newMenuscript = {
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
        authorEmail: user.email,
        authorRole,
        authorSequence: authors,
        fundingSource,
        dateTime
      };
      // https://final-project-server-k11k.onrender.com
      fetch('http://localhost:5000/newMenuscript', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newMenuscript)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            console.log('uploaded');
            console.log(id);
            if (id !== 'newMenuscript') {
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
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!title) setPreviewError('Title is required');
    else if (!abstract) setPreviewError('Abstract is required');
    else if (!keywords) setPreviewError('Keywords are required');
    else if (keywordError) setPreviewError(keywordError);
    else if (!description) setPreviewError('Description is required');
    else if (!firstName) setPreviewError('First Name is required');
    else if (!lastName) setPreviewError('Last Name is required');
    else if (!country) setPreviewError('Country is required');
    else if (!department) setPreviewError('Department is required');
    else if (!institute) setPreviewError('Institute is required');
    else if (!authorRole) setPreviewError('Author role is required');
    else {
      const newMenuscript = {
        title,
        abstract,
        keywords,
        description,
        authorInfo: {
          firstName,
          lastName,
          authorEmail: user.email,
          country,
          department,
          institute
        },
        authorRole,
        authorSequence: authors,
        fundingSource
      };
      navigate('/newMenuscript/preview', {
        replace: true,
        state: { newMenuscript, id }
      });
    }
  };
  console.log(authors);

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl pt-2'>New Menuscript</h2>
      <form onSubmit={(e) => handlePostArticle(e)}>
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
                    setDraftError('');
                    setPreviewError('');
                    setTitle(e.target.value);
                  }}
                  defaultValue={selectedDraft.title}
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
              <span className='text-red-700 text-sm'>{draftError}</span>
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
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.abstract}
                  required
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
                      setPreviewError('');
                    }
                  }}
                  defaultValue={selectedDraft.keywords}
                />
                <label
                  htmlFor='keywords'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Keywords (Separated by Comma)
                </label>
              </div>
              <span className='text-sm text-red-700'>{keywordError}</span>
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
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.description}
                  required
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
                        setPreviewError('');
                      }}
                      defaultValue={selectedDraft.firstName}
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
                        setPreviewError('');
                      }}
                      defaultValue={selectedDraft.lastName}
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
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.country}
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
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.department}
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
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.institute}
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
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.authorRole}
                    required
                  >
                    <option value=''>- - Please Select Role - -</option>
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
                {/* ---------------------how many authors?---------------------- */}
                <div className='form-control my-2'>
                  <div className='relative'>
                    <select
                      id='numberOfAuthors'
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white'
                      name='authorRole'
                      value={authors.length}
                      onChange={(e) => {
                        const numberOfAuthors = parseInt(e.target.value);
                        console.log(numberOfAuthors);
                        switch (numberOfAuthors) {
                          case 1:
                            setAuthors([{ authorName: '', authorEmail: '' }]);
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
                      <option value=''>- - How many authors? - -</option>
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
                  defaultValue={selectedDraft.fundingSource}
                  autoComplete='off'
                />
                <label
                  htmlFor='fundingSource'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Funding Source (If any)
                </label>
              </div>
              <span className='text-red-700 text-center'>{keywordError}</span>
              <span className='text-red-700'>{draftError}</span>
              <span className='text-red-700'>{previewError}</span>
            </div>

            <div className='form-control'>
              <p className='text-sm text-red-700 m-0 p-0'>{errorMessage}</p>
              <div className='flex justify-around'>
                <button
                  className='btn btn-primary w-[32%]'
                  onClick={(e) => handleDraft(e)}
                >
                  Save and Exit
                </button>
                <button
                  className='btn btn-primary w-[32%]'
                  onClick={(e) => {
                    handlePreview(e);
                  }}
                >
                  Preview
                </button>
                <button type='submit' className='btn btn-primary w-[32%]'>
                  Menuscript Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewMenuScript;
