import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Article = () => {
  const [article, setArticle] = useState({});
  const location = useLocation();
  console.log(location);
  const articleId = location.pathname.split('/')[2];
  const { title, description, abstract, date } = article;

  useEffect(() => {
    fetch(`http://localhost:5000/article?articleId=${articleId}`).then((res) =>
      res.json().then((data) => setArticle(data))
    );
  }, [articleId]);

  return (
    <div className='mt-2'>
      <h2 className='text-center text-3xl pb-2'>Article Details</h2>
      <div className='card max-w-lg mx-auto border-2'>
        <div className='card-body'>
          <h2 className='card-title'>{title}</h2>
          <p>
            <span className='font-bold'>Abstract:</span> {abstract}
          </p>
          <p>
            <span className='font-bold'>Description:</span> {description}
          </p>
          <div className='card-actions'>
            <button className='btn btn-primary'>Action</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
