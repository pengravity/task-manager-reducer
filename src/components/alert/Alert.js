import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';

import './Alert.css';

const Alert = () => {
  return (
    <div className='alert'>
      <BsFillExclamationCircleFill size={18} className='icon' />
      <span className='msg'>Please enter name and date </span>
      <div className='close-btn '>
        <RiCloseFill size={20} className='icon' />
      </div>
    </div>
  );
};

export default Alert;
