import React from 'react';
import UpdateProfile from '../Utilities/UpdateProfile';

const PaymentStatus = ({ selectedManuscriptForPaymentStatus }) => {
  UpdateProfile();
  const { manuscriptId, title, paperStatus, decision, payment } =
    selectedManuscriptForPaymentStatus || {};

  return (
    <dialog id='my_modal_3' className='modal'>
      <div className='modal-box max-w-xl border-[16px] border-white pr-4'>
        {manuscriptId ? (
          <>
            <h2 className='text-center text-3xl'>Payment Status</h2>
            <div className='card w-[95%] mx-auto bg-base-100 shadow-xl pb-4 text-start'>
              <div className='card-body'>
                <h2 className='card-title text-lg'>
                  Manuscript: {manuscriptId}
                </h2>
                <p>
                  Title: <span>{title}</span>
                </p>
                <p>
                  Paper Status: <span>{paperStatus}</span>
                </p>
                <p>
                  Decision: <span>{decision}</span>
                </p>
                <p>
                  Payment Status: <span>{payment?.paymentStatus}</span>
                </p>
                <p>
                  Mobile No: <span>{payment?.mobileNumber}</span>
                </p>
                <p>
                  Transaction ID: <span>{payment?.transactionId}</span>
                </p>
                <p>
                  Payment Time: <span>{payment?.paymentTime}</span>
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

export default PaymentStatus;
