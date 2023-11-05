import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Loading from '../Utilities/Loading';
import toast from 'react-hot-toast';
import useDateTime from '../../hooks/useDateTime';

const Payment = ({
  selectedManuscriptForPayment,
  isModified = false,
  setIsModified = ''
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [dateTime] = useDateTime();
  const { manuscriptId } = selectedManuscriptForPayment || {};

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    const payableAmount = e.target.payableAmount.value;
    const mobileNumber = e.target.mobileNumber.value;
    fetch(`http://localhost:5000/payment?manuscriptId=${manuscriptId}`, {
      method: 'put',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ payableAmount, mobileNumber, dateTime })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success('Payment Successful!');
          setPaymentLoading(false);
          setIsModified(!isModified);
        }
      });
  };

  return (
    <dialog id='my_modal_2' className='modal'>
      <div className='modal-box max-w-xl border-[16px] border-white pr-4'>
        {manuscriptId ? (
          <>
            <h2 className='text-center text-3xl'>Payment</h2>
            <div className='card w-[95%] mx-auto bg-base-100 shadow-xl pb-4 text-start'>
              <div className='card-body'>
                <h2 className='card-title'>
                  Paying for Manuscript: {manuscriptId}
                </h2>

                <form onSubmit={(e) => handlePayment(e)}>
                  <div className='flex gap-2'>
                    <div className='relative'>
                      <input
                        type='number'
                        id='payableAmount'
                        className='block px-2.5 pb-2.5 pt-4 w-full focus:bg-white text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                        placeholder=''
                        name='payableAmount'
                        autoComplete='off'
                        defaultValue='3000'
                        disabled
                        required
                      />
                      <label
                        htmlFor='payableAmount'
                        className='absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                      >
                        Payable Amount (
                        <FontAwesomeIcon icon={faBangladeshiTakaSign} />)
                      </label>
                    </div>
                    <div className='relative'>
                      <input
                        type='text'
                        id='mobileNumber'
                        className='block px-2.5 pb-2.5 pt-4 w-full focus:bg-white text-sm rounded-lg appearance-none peer border hover:input-primary focus:input-primary focus:outline-0'
                        placeholder=''
                        name='mobileNumber'
                        autoComplete='off'
                        required
                      />
                      <label
                        htmlFor='mobileNumber'
                        className='absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 hover:cursor-text'
                      >
                        Mobile Number
                      </label>
                    </div>
                  </div>
                  <button className='btn btn-primary btn-sm block w-1/2 mx-auto my-2'>
                    {paymentLoading ? (
                      <>
                        Paying <Loading />
                      </>
                    ) : (
                      'Pay'
                    )}
                  </button>
                </form>

                <p className='text-center text-2xl text-orange-700'>
                  This is demo payment. The page is under development
                </p>
              </div>
            </div>
            <form method='dialog'>
              <button className='btn btn-primary block w-1/2 mx-auto mt-8'>
                Close Manuscript
              </button>
            </form>
          </>
        ) : (
          ''
        )}
      </div>
    </dialog>
  );
};

export default Payment;