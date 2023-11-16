import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { storage } from '../../firebase.config';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthorTemplate from '../Utilities/AuthorTemplate';
import Loading from '../Utilities/Loading';
import useDateTime from '../../hooks/useDateTime';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable
} from 'firebase/storage';
import { signOut } from 'firebase/auth';

const NewManuscript = () => {
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [draftError, setDraftError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [keywordError, setKeywordError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const location = useLocation();

  let selectedDraft = {};
  if (location.state?.selectedDraft) {
    selectedDraft = location.state?.selectedDraft;
  } else if (location.state?.manuscript) {
    const { authorInfo, ...manuscriptWithoutAuthorInfo } =
      location.state?.manuscript;
    selectedDraft = { ...manuscriptWithoutAuthorInfo, ...authorInfo };
  }

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
  const [images, setImages] = useState([]);
  const [imageUrls, setImagesUrls] = useState([]);
  const [draftFile, setDraftFile] = useState('');
  const [draftFileUrl, setDraftFileUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterUrl, setCoverLetterUrl] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [draftFileErrorMessage, setDraftFileErrorMessage] = useState('');
  const [coverLetterErrorMessage, setCoverLetterErrorMessage] = useState('');
  const [fileDateTime, setFileDateTime] = useState('');
  const navigate = useNavigate();

  const id = selectedDraft._id || 'newManuscript';

  const [dateTime] = useDateTime();
  const date = new Date();
  const dateTimeForFiles = `${date.getFullYear()}${
    date.getMonth().toString().length === 1
      ? '0' + date.getMonth()
      : date.getMonth()
  }${
    date.getDate().toString().length === 1
      ? '0' + date.getDate()
      : date.getDate()
  }${
    date.getHours().toString().length === 1
      ? '0' + date.getHours()
      : date.getHours()
  }${
    date.getMinutes().toString().length === 1
      ? '0' + date.getMinutes()
      : date.getMinutes()
  }${
    date.getSeconds().toString().length === 1
      ? '0' + date.getSeconds()
      : date.getSeconds()
  }`;

  const handleDraft = (e) => {
    e.preventDefault();
    if (!title) {
      setDraftError('Your draft must have a title!');
    } else {
      setSaving(true);
      const draftManuscript = {
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
        authorSequence: authors,
        fundingSource,
        dateTime,
        authorEmail: user.email
      };
      const newDraft = selectedDraft?.manuscriptId
        ? { ...selectedDraft, ...draftManuscript, revising: true }
        : draftManuscript;
      const url =
        id === 'newManuscript'
          ? 'https://final-project-server-k11k.onrender.com/newDraftManuscript'
          : `https://final-project-server-k11k.onrender.com/updateDraftManuscript/${id}`;

      fetch(url, {
        method: id === 'newManuscript' ? 'post' : 'put',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newDraft)
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
    }
  };

  const handleUploadManuscript = (e) => {
    e.preventDefault();
    if (!keywordError) {
      setUploading(true);
      // ---------------upload images-------------------
      let index = 0;
      const uploadFiles = (i, arr) => {
        const imgReference = ref(
          storage,
          `files/images/${dateTimeForFiles}_manuscript_image_${i + 1}.${
            images[i]?.name?.split('.')[images[i]?.name?.split('.')?.length - 1]
          }`
        );
        const uploadTask = uploadBytesResumable(imgReference, images[i]);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            //
          },
          (error) => {
            //
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const newArray = [...arr, downloadURL];
              if (index + 1 < images.length) {
                uploadFiles(++index, newArray);
              } else {
                setImagesUrls(newArray);
              }
            });
          }
        );
      };
      if (index < images.length) {
        uploadFiles(index, imageUrls);
      }
      // --------------------upload draft file---------------------
      const draftFileReference = ref(
        storage,
        `files/draftFilesPDF/${dateTimeForFiles}_manuscript_draft.${
          draftFile?.name?.split('.')[draftFile?.name?.split('.')?.length - 1]
        }`
      );
      uploadBytes(draftFileReference, draftFile).then(() => {
        getDownloadURL(draftFileReference).then((url) => {
          setDraftFileUrl(url);
        });
      });

      // -------------------upload cover letter----------------------
      const coverLetterReference = ref(
        storage,
        `files/coverLettersPDF/${dateTimeForFiles}_manuscript_cover_letter.${
          coverLetter?.name?.split('.')[
            coverLetter?.name?.split('.')?.length - 1
          ]
        }`
      );
      uploadBytes(coverLetterReference, coverLetter).then(() => {
        getDownloadURL(coverLetterReference).then((url) => {
          setCoverLetterUrl(url);
        });
      });
      setFileDateTime(dateTimeForFiles);
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
      const newAuthorList = authors?.map((author) => {
        if (author.authorEmail.toLowerCase() === user?.email) {
          setErrorMessage(
            'Your email and any other author email can not be same'
          );
          return [];
        } else {
          const newAuthor = {
            authorName: author.authorName,
            authorEmail: author.authorEmail.toLowerCase()
          };
          return newAuthor;
        }
      });

      if (errorMessage) {
        return;
      }
      const newManuscript = {
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
        paperStatus: 'Pending',
        decision: '-'
      };
      navigate('/newManuscript/preview', {
        replace: true,
        state: { newManuscript, id }
      });
    }
  };

  // -------------------upload manuscript-----------------------
  useEffect(() => {
    if (images.length === imageUrls.length && draftFileUrl && coverLetterUrl) {
      const newAuthorList = authors?.map((author) => {
        if (author.authorEmail.toLowerCase() === user?.email) {
          setErrorMessage(
            'Your email and any other author email can not be same'
          );
          return {};
        } else {
          const newAuthor = {
            authorName: author.authorName,
            authorEmail: author.authorEmail.toLowerCase()
          };
          return newAuthor;
        }
      });

      if (errorMessage) {
        setUploading(false);
        return;
      }
      const newManuscript = {
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
        files: {
          imageUrls,
          draftFileUrl,
          coverLetterUrl,
          dateTimeForFiles: fileDateTime
        }
      };
      fetch('https://final-project-server-k11k.onrender.com/newManuscript', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(newManuscript)
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
            if (id !== 'newManuscript') {
              fetch(
                `https://final-project-server-k11k.onrender.com/deleteDraft/${id}`,
                {
                  method: 'delete',
                  headers: {
                    authorization: `Bearer ${localStorage.getItem(
                      'accessToken'
                    )}`
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
    }
  }, [
    abstract,
    authorRole,
    authors,
    country,
    coverLetterUrl,
    dateTime,
    department,
    description,
    draftFileUrl,
    errorMessage,
    firstName,
    fundingSource,
    id,
    imageUrls,
    images,
    institute,
    keywords,
    lastName,
    navigate,
    title,
    user,
    fileDateTime
  ]);

  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl pt-2'>
        {location.state?.old
          ? `Revise Manuscript: ${selectedDraft?.manuscriptId}`
          : 'New Manuscript'}
      </h2>
      <form onSubmit={(e) => handleUploadManuscript(e)}>
        <div
          className={`card mx-auto w-full max-w-3xl shadow-2xl bg-base-100 mb-10 ${
            (uploading || saving) && '!opacity-50'
          }`}
        >
          <div className='card-body'>
            {/* -----------------Title----------------- */}
            <div className='form-control'>
              <div className='relative'>
                <input
                  type='text'
                  id='title'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                  placeholder=''
                  onChange={(e) => {
                    setDraftError('');
                    setPreviewError('');
                    setTitle(e.target.value);
                  }}
                  defaultValue={selectedDraft.title}
                  required
                  autoComplete='off'
                  disabled={uploading || saving}
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
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:textarea-primary focus:textarea-primary focus:outline-0 disabled:hover:textarea-secondary'
                  placeholder=''
                  onChange={(e) => {
                    setAbstract(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.abstract}
                  required
                  autoComplete='off'
                  disabled={uploading || saving}
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
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:textarea-secondary'
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
                  autoComplete='off'
                  disabled={uploading || saving}
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
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:textarea-primary focus:textarea-primary focus:outline-0 disabled:hover:textarea-secondary'
                  placeholder=''
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setPreviewError('');
                  }}
                  defaultValue={selectedDraft.description}
                  required
                  autoComplete='off'
                  disabled={uploading || saving}
                />
                <label
                  htmlFor='description'
                  className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Description
                </label>
              </div>
            </div>

            {/* ---------------------files-------------------- */}
            {/* ---------------image--------------- */}
            <div className='form-control w-full'>
              <div className='relative'>
                <div id='images'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:file-input-primary focus:file-input-primary focus:outline-0 disabled:hover:file-input-secondary ${
                      imageErrorMessage && '!border-red-700'
                    }`}
                    onChange={(e) => {
                      const inputtedFiles = e.target.files;
                      let filesArray = [];
                      for (let i = 0; i < inputtedFiles.length; i++) {
                        if (inputtedFiles[i].size > 1024000) {
                          setImageErrorMessage(
                            'Each file size must be less than 1 MB'
                          );
                          break;
                        }
                        filesArray = [...filesArray, inputtedFiles[i]];
                      }
                      setImages(filesArray);
                    }}
                    onClick={() => setImageErrorMessage('')}
                    required
                    disabled={uploading || saving}
                  />
                </div>
                <label
                  htmlFor='images'
                  className='absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                >
                  Necessary Images (Any image; Not more than 1 MB)
                </label>
              </div>
              <span className='text-sm text-center text-red-700'>
                {imageErrorMessage}
              </span>
            </div>

            <div className='flex justify-between gap-2'>
              {/* ---------------draft file--------------- */}
              <div className='form-control w-full'>
                <div className='relative'>
                  <div id='draftFile'>
                    <input
                      type='file'
                      accept='.pdf'
                      name='draftFile'
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:file-input-primary focus:file-input-primary focus:outline-0 disabled:hover:file-input-secondary ${
                        draftFileErrorMessage && '!border-red-700'
                      }`}
                      onChange={(e) => {
                        if (e.target.files[0].size > 5120000) {
                          setDraftFileErrorMessage(
                            'The file size must be less than 5 MB'
                          );
                        } else {
                          setDraftFile(e.target.files[0]);
                        }
                      }}
                      onClick={() => setDraftFileErrorMessage('')}
                      required
                      disabled={uploading || saving}
                    />
                  </div>
                  <label
                    htmlFor='draftFile'
                    className='absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                  >
                    Draft File (PDF; Not more than 5 MB)
                  </label>
                </div>
                <span className='text-sm text-center text-red-700'>
                  {draftFileErrorMessage}
                </span>
              </div>

              {/* ---------------cover letter--------------- */}
              <div className='form-control w-full'>
                <div className='relative'>
                  <div id='coverLetter'>
                    <input
                      type='file'
                      accept='.pdf'
                      name='coverLetter'
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:file-input-primary focus:file-input-primary focus:outline-0 disabled:hover:file-input-secondary ${
                        coverLetterErrorMessage && '!border-red-700'
                      }`}
                      onChange={(e) => {
                        if (e.target.files[0].size > 5120000) {
                          setCoverLetterErrorMessage(
                            'The file size must be less than 5 MB'
                          );
                        } else {
                          setCoverLetter(e.target.files[0]);
                        }
                      }}
                      onClick={() => setCoverLetterErrorMessage('')}
                      required
                      disabled={uploading || saving}
                    />
                  </div>
                  <label
                    htmlFor='coverLetter'
                    className='absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                  >
                    Cover Letter (PDF; Not more than 5 MB)
                  </label>
                </div>
                <span className='text-sm text-center text-red-700'>
                  {coverLetterErrorMessage}
                </span>
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
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                      placeholder=''
                      name='firstName'
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setPreviewError('');
                      }}
                      defaultValue={selectedDraft.firstName}
                      required
                      autoComplete='off'
                      disabled={uploading || saving}
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
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                      placeholder=''
                      name='lastName'
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setPreviewError('');
                      }}
                      defaultValue={selectedDraft.lastName}
                      required
                      autoComplete='off'
                      disabled={uploading || saving}
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
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
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
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                    placeholder=''
                    name='country'
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.country}
                    required
                    autoComplete='off'
                    disabled={uploading || saving}
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
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                    placeholder=''
                    name='department'
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.department}
                    required
                    autoComplete='off'
                    disabled={uploading || saving}
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
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                    placeholder=''
                    name='institute'
                    onChange={(e) => {
                      setInstitute(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.institute}
                    required
                    autoComplete='off'
                    disabled={uploading || saving}
                  />
                  <label
                    htmlFor='institute'
                    className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                  >
                    Institute
                  </label>
                </div>
              </div>
              {/* ---------------author role---------------- */}
              <div className='form-control mt-2'>
                <div className='relative'>
                  <select
                    id='authorRole'
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white disabled:hover:select-secondary'
                    name='authorRole'
                    onChange={(e) => {
                      setAuthorRole(e.target.value);
                      setPreviewError('');
                    }}
                    defaultValue={selectedDraft.authorRole}
                    required
                    disabled={uploading || saving}
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
              {/* ----------------author sequence---------------- */}
              <div className='form-control'>
                <label className='label py-1'>
                  <span className='label-text'>Author Sequence</span>
                </label>
                {/* -------------number of authors------------- */}
                <div className='form-control my-2'>
                  <div className='relative'>
                    <select
                      id='numberOfAuthors'
                      className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg peer border hover:select-primary focus:select-primary focus:outline-0 bg-white disabled:hover:select-secondary'
                      name='authorRole'
                      value={authors.length}
                      onChange={(e) => {
                        const numberOfAuthors = parseInt(e.target.value);
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
                      disabled={uploading || saving}
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
                      setAuthors={setAuthors}
                      authors={authors}
                      author={author}
                      setErrorMessage={setErrorMessage}
                      saving={saving}
                      uploading={uploading}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* -------------------funding source------------------ */}
            <div className='form-control'>
              <div className='relative'>
                <input
                  type='text'
                  id='fundingSource'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0 disabled:hover:input-secondary'
                  placeholder=''
                  name='fundingSource'
                  onChange={(e) => setFundingSource(e.target.value)}
                  defaultValue={selectedDraft.fundingSource}
                  autoComplete='off'
                  disabled={uploading || saving}
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

            {/* ----------------------actions---------------------- */}
            <div className='form-control'>
              <p className='text-sm text-center text-red-700 m-0 py-2'>
                {errorMessage}
              </p>
              <div className='flex justify-around'>
                <button
                  className='btn btn-primary w-[32%] disabled:bg-slate-500'
                  disabled={saving}
                  onClick={(e) => handleDraft(e)}
                >
                  Save and Exit {saving ? <Loading /> : ''}
                </button>
                <button
                  className='btn btn-primary w-[32%]'
                  onClick={(e) => {
                    handlePreview(e);
                  }}
                >
                  Preview
                </button>
                <button
                  type='submit'
                  className='btn btn-primary w-[32%] disabled:bg-slate-500'
                  disabled={uploading}
                >
                  Manuscript Upload {uploading ? <Loading /> : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewManuscript;
