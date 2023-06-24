import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NewArticle = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const date = new Date().toString().split('GMT')[0] + 'BDT';
  // const dateTime=date.getDate().toString()+date.getMonth().toString()+date

  const handlePostArticle = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const abstract = e.target.abstract.value;
    const description = e.target.description.value;
    const newArticle = {
      title,
      abstract,
      description,
      authorName: user.displayName,
      authorEmail: user.email,
      date
    };
    // console.log(newArticle);
    fetch('http://localhost:5000/addArticle', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newArticle)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success('Article posted successfully');
          navigate('/availableArticles', { replace: true });
        }
      });
  };

  return (
    <div>
      <h2 className='text-center text-3xl pt-2'>New Article</h2>
      <form onSubmit={(e) => handlePostArticle(e)}>
        <div className='card mx-auto w-full max-w-lg shadow-2xl bg-base-100'>
          <div className='card-body'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Title</span>
              </label>
              <input
                type='text'
                placeholder='Title of the Article'
                className='input input-bordered'
                name='title'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Abstract</span>
              </label>
              <input
                type='text'
                placeholder='Abstract of the Article'
                className='input input-bordered'
                name='abstract'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Description</span>
              </label>
              <textarea
                placeholder='Description'
                className='textarea textarea-bordered'
                name='description'
                required
              />
            </div>
            <div className='form-control mt-'>
              <p className='text-sm text-red-700 m-0 p-0'>{errorMessage}</p>
              <button type='submit' className='btn btn-primary'>
                Post Article
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewArticle;
