import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const [authorInfo1, setAuthorInfo1] = useState(
    selectedDraft.authorInfo1 || ''
  );
  const [authorInfo2, setAuthorInfo2] = useState(
    selectedDraft.authorInfo2 || ''
  );
  const [authorInfo3, setAuthorInfo3] = useState(
    selectedDraft.authorInfo3 || ''
  );
  const [fundingSource, setFundingSource] = useState(
    selectedDraft.fundingSource || 'not applicable'
  );
  const navigate = useNavigate();

  const id = selectedDraft._id || 'noMenuscript';

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
        authorInfo1,
        authorInfo2,
        authorInfo3,
        fundingSource,
        dateTime,
        authorEmail: user.email
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
    }
  };

  const handlePostArticle = (e) => {
    e.preventDefault();
    if (!keywordError) {
      // const title = e.target.title.value;
      // const abstract = e.target.abstract.value;
      // const keywords = e.target.keywords.value;
      // const description = e.target.description.value;
      // const firstName = e.target.firstName.value;
      // const lastName = e.target.lastName.value;
      // const authorEmail = user.email;
      // const country = e.target.country.value;
      // const department = e.target.department.value;
      // const institute = e.target.institute.value;
      // const authorRole = e.target.authorRole.value;
      // const authorInfo1 = e.target.authorInfo1.value;
      // const authorInfo2 = e.target.authorInfo2.value;
      // const authorInfo3 = e.target.authorInfo3.value;
      // const authorSequence = { authorInfo1, authorInfo2, authorInfo3 };
      // const fundingSource = e.target.fundingSource.value || 'not applicable';
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
        authorSequence: { authorInfo1, authorInfo2, authorInfo3 },
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
    else if (!authorInfo1) setPreviewError('First author info is required');
    else if (!authorInfo2) setPreviewError('Second author info is required');
    else if (!authorInfo3) setPreviewError('Third author info is required');
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
        authorSequence: { authorInfo1, authorInfo2, authorInfo3 },
        fundingSource
      };
      navigate('/newMenuscript/preview', {
        replace: true,
        state: { newMenuscript, id }
      });
    }
  };
  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl pt-2'>New Menuscript</h2>
      <form onSubmit={(e) => handlePostArticle(e)}>
        <div className='card mx-auto w-full max-w-2xl shadow-2xl bg-base-100'>
          <div className='card-body'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Title</span>
              </label>
              <input
                type='text'
                placeholder='Title of the Menuscript'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='title'
                onChange={(e) => {
                  setDraftError('');
                  setPreviewError('');
                  setTitle(e.target.value);
                }}
                defaultValue={selectedDraft.title}
                required
              />
              <span className='text-red-700 text-sm'>{draftError}</span>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Abstract</span>
              </label>
              <input
                type='text'
                placeholder='Abstract of the Menuscript'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='abstract'
                onChange={(e) => {
                  setAbstract(e.target.value);
                  setPreviewError('');
                }}
                defaultValue={selectedDraft.abstract}
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>
                  Keywords (Separated by Comma)
                </span>
              </label>
              <textarea
                placeholder='Enter keyword (minimum 5)'
                className='textarea textarea-secondary hover:textarea-primary focus:textarea-primary focus:outline-0'
                name='keywords'
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
              <span className='text-sm text-red-700'>{keywordError}</span>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Description</span>
              </label>
              <textarea
                placeholder='Description'
                className='textarea textarea-secondary hover:textarea-primary focus:textarea-primary focus:outline-0'
                name='description'
                onChange={(e) => {
                  setDescription(e.target.value);
                  setPreviewError('');
                }}
                defaultValue={selectedDraft.description}
                required
              />
            </div>
            <div className='border-2 border-dashed rounded p-2'>
              Author Info
              <div className='flex justify-between'>
                <div className='form-control w-[49%]'>
                  <label className='label'>
                    <span className='label-text'>First Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='First name'
                    className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                    name='firstName'
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.firstName}
                    required
                  />
                </div>
                <div className='form-control w-[49%]'>
                  <label className='label'>
                    <span className='label-text'>Last Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Last name'
                    className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                    name='lastName'
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.lastName}
                    required
                  />
                </div>
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  placeholder='Last name'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                  name='email'
                  disabled
                  defaultValue={user.email}
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Country</span>
                </label>
                <input
                  type='text'
                  placeholder='Country'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                  name='country'
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.country}
                  required
                />
              </div>
              <p className='pt-2 pl-1'>Affiliation</p>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Department</span>
                </label>
                <input
                  type='text'
                  placeholder='Enter Department'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                  name='department'
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.department}
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Institute</span>
                </label>
                <input
                  type='text'
                  placeholder='Enter Institute'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                  name='institute'
                  onChange={(e) => {
                    setInstitute(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.institute}
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Author Role</span>
                </label>
                <select
                  className='select select-secondary hover:select-primary focus:select-primary focus:outline-0 text-sm font-normal'
                  name='authorRole'
                  onChange={(e) => {
                    setAuthorRole(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.authorRole}
                  required
                >
                  <option value=''>- - Please Select Role - -</option>
                  <option value='coAuthor'>Co-Author</option>
                  <option value='correspondingAuthor'>
                    Corresponding Author
                  </option>
                </select>
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>
                    Author Sequence (According to Position)
                  </span>
                </label>
                <input
                  type='text'
                  placeholder='Enter Author Info'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm mb-2'
                  name='authorInfo1'
                  onChange={(e) => {
                    setAuthorInfo1(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.authorInfo1}
                  required
                />
                <input
                  type='text'
                  placeholder='Enter Author Info'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm mb-2'
                  name='authorInfo2'
                  onChange={(e) => {
                    setAuthorInfo2(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.authorInfo2}
                  required
                />
                <input
                  type='text'
                  placeholder='Enter Author Info'
                  className='input input-secondary hover:input-primary focus:input-primary focus:outline-0 text-sm'
                  name='authorInfo3'
                  onChange={(e) => {
                    setAuthorInfo3(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.authorInfo3}
                  required
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Funding Source</span>
              </label>
              <input
                placeholder='Enter Funding Source (If any)'
                className='input input-secondary hover:input-primary focus:input-primary focus:outline-0'
                name='fundingSource'
                onChange={(e) => setFundingSource(e.target.value)}
                defaultValue={selectedDraft.fundingSource}
              />
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
