import React, { useEffect, useState } from 'react';
import './AvailableArticles.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.config';
import { Link } from 'react-router-dom';

const AvailableArticles = () => {
  const [articles, setArticles] = useState([]);
  const [user] = useAuthState(auth);
  const { email } = user || {};
  const userRole = localStorage.getItem('userRole');
  // console.log(user);
  const authorLink = `http://localhost:5000/authorArticles?authorEmail=${email}`;
  const editorLink = 'http://localhost:5000/articles';

  useEffect(() => {
    fetch(userRole === 'author' ? authorLink : editorLink)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, [email, authorLink, userRole]);

  console.log(articles);
  return (
    <div className='pb-4'>
      <h2 className='text-center text-3xl my-2'>Available Articles</h2>
      <div className='overflow-x-auto max-w-4xl mx-auto bg-gray-100'>
        <table className='table text-center'>
          {/* head */}
          <thead className='bg-gray-200 text-slate-900'>
            <tr>
              <th className='w-[10%]'>SL</th>
              <th>Title</th>
              <th>Author Name</th>
              <th>Date</th>
              <th className='w-[10%]'>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {articles.toReversed().map((article, index) => (
              <tr>
                <th>{index + 1}</th>
                <td>{article.title}</td>
                <td>{article.authorName}</td>
                <td>{article.date}</td>
                <td>
                  <Link
                    to={`/availableArticles/${article._id}`}
                    className='btn btn-sm btn-primary'
                    state={article}
                  >
                    Preview
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableArticles;
