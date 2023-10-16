import {
  faArrowDown,
  faArrowUp,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const AuthorTemplate = ({
  authorName,
  authorEmail,
  removeAuthor,
  index,
  authorsLength,
  setAuthors,
  authors,
  disableRemoveButton
}) => {
  const [inputtedData, setInputtedData] = useState({});
  // console.log(authorsLength);
  return (
    <div className='flex justify-around border rounded p-1 items-center mb-1'>
      <div className='relative w-2/5'>
        <input
          type='text'
          id={`authorName${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          onChange={(e) => {
            setInputtedData({ authorName: e.target.value });
          }}
        />
        <label
          htmlFor={`authorName${index + 1}`}
          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
        >
          Author Name
        </label>
      </div>
      <div className='relative w-2/5'>
        <input
          type='text'
          id={`authorEmail${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          onChange={(e) => {
            setInputtedData({ ...inputtedData, authorEmail: e.target.value });
          }}
          onBlur={() => {
            const selectedAuthor = authors.slice(index, index + 1);
            // const
            // setAuthors([...authors, inputtedData])
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
        <button className='btn btn-sm btn-primary'>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button className='btn btn-sm btn-primary'>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <button
        className='btn btn-sm btn-primary text-lg'
        onClick={(e) => {
          e.preventDefault();
          removeAuthor(index);
        }}
        disabled={disableRemoveButton}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default AuthorTemplate;
