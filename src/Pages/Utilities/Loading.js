import React from 'react';

const Loading = ({ loadingStyles = 'loading-sm' }) => {
  return (
    <div>
      <span className={`loading loading-spinner ${loadingStyles}`} />
    </div>
  );
};

export default Loading;
