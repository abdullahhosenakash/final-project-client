import React from 'react';
import hstuLogo from '../../assets/hstu_logo_.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

const Home = () => {
  return (
    <div>
      <div className='flex justify-around absolute left-0 right-0 top-0 bg-primary'>
        <img src={hstuLogo} width={120} className=' bg-white' alt='' />
        <h2 className=' text-3xl py-8 text-white uppercase'>
          Journal of Science and Technology
        </h2>
        {/* below <div /> tag is for making an empty element for justifying content */}
        <div />
      </div>
      <div className='relative mx-8'>
        <div className='absolute top-44'>
          <h3 className='text-xl border-b-2 mb-2 w-fit border-primary'>
            About JST
          </h3>
          <p className='text-justify mb-6'>
            The Journal of Science and Technology is a journal of Hajee Mohammad
            Danesh Science and Technology University. The journal has an
            international scope with broad constituency of scientists in the
            agricultural sciences, engineering, business studies, basic sciences
            and humanities, and annually publishes original articles, review
            papers and technical notes. A number of editorial members guide
            manuscripts through the review process and properly formatted papers
            are accepted for publication. Authors from all concerns of science
            and technology are requested to submit manuscripts for publication
            to this journal. We ensure speedy responses to authors and rapid
            publication, with all papers being reviewed by at least two
            independent referees.
          </p>

          <h3 className='text-xl border-b-2 mb-2 w-fit border-primary'>
            Key Features
          </h3>

          <div className='flex gap-24'>
            <div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Easy access
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> International quality
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Published binnually
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> High visibility
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Rapid publication
                (online and print)
              </div>
            </div>
            <div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Hard or online
                manuscript submission
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Reasonable printing and
                publication charges
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Flexibility
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Best research paper
                awards in each journal issue
              </div>
              <div>
                <FontAwesomeIcon icon={faSquareCheck} /> Copyright
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 py-2 bg-primary'>
        <div className='text-center text-slate-200'>
          Journal of Science and Technology, HSTU{' '}
          <FontAwesomeIcon icon={faCopyright} className='mx-2' /> All Rights
          Reserved
        </div>
      </div>
    </div>
  );
};

export default Home;
