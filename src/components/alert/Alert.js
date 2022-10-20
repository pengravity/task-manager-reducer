import { useEffect } from 'react';

import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';

import './Alert.css';

const Alert = ({ alertClass, alertContent, onCloseAlert }) => {
  useEffect(() => {
    const displayAlert = setTimeout(() => {
      onCloseAlert();
    }, 4000);

    return () => {
      clearTimeout(displayAlert);
    };
  });

  return (
    <div className={`alert ${alertClass}`}>
      <BsFillExclamationCircleFill size={18} className='icon' />
      <span className='msg'>{alertContent} </span>
      <div className='close-btn ' onClick={onCloseAlert}>
        <RiCloseFill size={20} className='icon' />
      </div>
    </div>
  );
};

export default Alert;
