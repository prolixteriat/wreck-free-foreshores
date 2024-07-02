import { useContext, useState } from 'react';

import { topStyle, WrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';
import { IApiStatus } from '@lib/poster';

import { Loading, StatusMessage } from '@components/Common';

import { CloseButton } from './common';
import { IFormProps } from './funcs';
import { login } from './callapi';
import { ForgottenPassword } from './ForgottenPassword';

// -----------------------------------------------------------------------------

export default function LoginForm(props: IFormProps): React.JSX.Element {
    
  const { isOpen, onClose } = props;
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<IApiStatus|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);

  const context = useContext(WrecksContext);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handleForgotClick = () => {
    const newIsForgotOpen = !isForgotOpen;
    setIsForgotOpen(newIsForgotOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  async function handleSubmit(event: React.FormEvent)  {
    event.preventDefault();
    try {
      setIsLoading(true);
      const newStatus = await login(email, password);
      setIsLoading(false);
      setStatus(newStatus);
      if (newStatus?.success) {
        new JwtManager().writeToken(newStatus?.message);
        context?.setMutate(context?.mutate+1);
        setEmail('');
        setPassword('');
        setStatus(null);
        onClose();
      } else {
        setIsStatusOpen(true);
      }      
    }
    finally {
      setIsLoading(false);
    }
  }

  const onCloseForgotDialog = () => {
    setIsForgotOpen(false);
    onClose();
  }

  const onCloseStatusDialog = () => {
    setIsStatusOpen(false);
  }

  return (
    <>
    {isLoading && <Loading centre={true}/> }
    <div style={topStyle}>
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
    <div className='modal-box'>
      <h2 className='font-bold text-lg'>Login</h2>
      <CloseButton onClose={onClose} />

      <form>
      <div className='form-control'>
        <label className='label' htmlFor='login_email'>
          <span className='label-text'>Email</span>
        </label>
        <input type='text' autoComplete='email' id='login_email' 
          className='input input-bordered' 
          placeholder= 'Enter email' value={email} 
          onChange={handleEmailChange} required />
      </div>

      <div className='form-control'>
        <label className='label' htmlFor='login_password'>
          <span className='label-text'>Password</span>
        </label>
        <div className='relative'>
          <input type={isPasswordVisible ? 'text' : 'password'}
            autoComplete='new-password' id='login_password' 
            className='input input-bordered w-full pr-16' 
            placeholder= 'Enter password' value={password}
            onKeyDown={handleKeyDown} 
            onChange={handlePasswordChange} required />
          <button className='btn absolute text-sm right-0 top-0 h-full rounded-l-none'
            onClick={togglePasswordVisibility}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <br />
      <a className='link link-primary' onClick={handleForgotClick}>
          Forgotten password?</a>

      <div className='modal-action'>
        <button type='button' className='btn' onClick={onClose}>Cancel</button>
        <button type='submit' className={'btn btn-primary'}
          onClick={handleSubmit}>Login</button>
      </div>
      </form>

      {isStatusOpen && status && 
          <StatusMessage status={status} onClose={onCloseStatusDialog} />}
      {<ForgottenPassword isOpen={isForgotOpen} onClose={onCloseForgotDialog} />}

    </div>
  </div>
  </div>
  </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
