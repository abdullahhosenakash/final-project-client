import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const AuthorTemplate = ({ index, setAuthors, authors, author }) => {
  const inputFunction = (e, from) => {
    let newAuthor;
    if (from === 'authorName') {
      newAuthor = { ...author, authorName: e.target.value };
    } else if (from === 'authorEmail') {
      newAuthor = { ...author, authorEmail: e.target.value };
    }
    const nextAuthors = authors.slice(index + 1);
    const previousAuthors = authors
      .toReversed()
      .slice(authors.length - index)
      .toReversed();
    const newAuthorList = [...previousAuthors, newAuthor, ...nextAuthors];
    setAuthors(newAuthorList);
  };

  return (
    <div className='flex justify-around border rounded p-1 items-center mb-1'>
      <div className='relative w-[45%]'>
        <input
          type='text'
          id={`authorName${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full focus:bg-white text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          autoComplete='off'
          value={author.authorName}
          onChange={(e) => {
            inputFunction(e, 'authorName');
          }}
        />
        <label
          htmlFor={`authorName${index + 1}`}
          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
        >
          Author Name
        </label>
      </div>
      <div className='relative w-[45%]'>
        <input
          type='email'
          id={`authorEmail${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          autoComplete='off'
          value={author.authorEmail}
          onChange={(e) => {
            inputFunction(e, 'authorEmail');
          }}
        />
        <label
          htmlFor={`authorEmail${index + 1}`}
          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
        >
          Author Email
        </label>
      </div>

      <div className='flex flex-col gap-1 justify-center items-center'>
        <button
          className={`btn btn-sm btn-primary ${index === 0 ? 'hidden' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const nextAuthors = authors.slice(index + 1);
            const previousAuthors = authors
              .toReversed()
              .slice(authors.length - (index - 1))
              .toReversed();
            const selectedAuthor = authors.slice(index, index + 1);
            const previousAuthor = authors.slice(index - 1, index);
            const newAuthorList = [
              ...previousAuthors,
              ...selectedAuthor,
              ...previousAuthor,
              ...nextAuthors
            ];
            setAuthors(newAuthorList);
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button
          className={`btn btn-sm btn-primary ${
            index === authors.length - 1 ? 'hidden' : ''
          }`}
          onClick={(e) => {
            e.preventDefault();
            const nextAuthors = authors.slice(index + 2);
            const previousAuthors = authors
              .toReversed()
              .slice(authors.length - index)
              .toReversed();
            const selectedAuthor = authors.slice(index, index + 1);
            const nextAuthor = authors.slice(index + 1, index + 2);
            const newAuthorList = [
              ...previousAuthors,
              ...nextAuthor,
              ...selectedAuthor,
              ...nextAuthors
            ];
            setAuthors(newAuthorList);
          }}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </div>
  );
};

export default AuthorTemplate;
