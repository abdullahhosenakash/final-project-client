import React from 'react';

const ReviewerTemplate = ({ index, setReviewers, reviewers, reviewer }) => {
  const inputFunction = (e, from) => {
    let newReviewer;
    if (from === 'reviewerName') {
      newReviewer = { ...reviewer, reviewerName: e.target.value };
    } else if (from === 'reviewerEmail') {
      newReviewer = {
        ...reviewer,
        reviewerEmail: e.target.value.toLowerCase()
      };
    }
    const nextReviewers = reviewers.slice(index + 1);
    const previousReviewers = reviewers
      .toReversed()
      .slice(reviewers.length - index)
      .toReversed();
    const newReviewerList = [
      ...previousReviewers,
      newReviewer,
      ...nextReviewers
    ];
    setReviewers(newReviewerList);
  };

  return (
    <div className='flex justify-around border rounded p-1 items-center mb-1'>
      <div className='relative w-[48%] my-1'>
        <input
          type='text'
          name={`reviewerName${index + 1}`}
          id={`reviewerName${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full focus:bg-white text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          autoComplete='off'
          value={reviewer.reviewerName}
          required
          onChange={(e) => {
            inputFunction(e, 'reviewerName');
          }}
        />
        <label
          htmlFor={`reviewerName${index + 1}`}
          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
        >
          Reviewer Name
        </label>
      </div>
      <div className='relative w-[48%] my-1'>
        <input
          type='email'
          name={`reviewerEmail${index + 1}`}
          id={`reviewerEmail${index + 1}`}
          className='block px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
          placeholder=''
          autoComplete='off'
          value={reviewer.reviewerEmail}
          required
          onChange={(e) => {
            inputFunction(e, 'reviewerEmail');
          }}
        />
        <label
          htmlFor={`reviewerEmail${index + 1}`}
          className='absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
        >
          Reviewer Email
        </label>
      </div>
    </div>
  );
};

export default ReviewerTemplate;
