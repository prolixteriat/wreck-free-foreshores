import { useState } from 'react';

import { termsUrl } from '@lib/config';
import { topStyle } from '@lib/global';
import { IApiStatus } from '@lib/poster';

import { Loading, StatusMessage } from '@components/Common';

import { CloseButton } from './common';
import { addUser } from './callapi';
import { IFormProps, validateAcceptTerms, validateEmail, validatePassword, 
        validateUsername } from './funcs';

// -----------------------------------------------------------------------------

export default function RegisterForm(props: IFormProps): React.JSX.Element {
    
  const { isOpen, onClose } = props;
  
  const errorClass = 'label-text text-red-500';

  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [acceptTermsError, setAcceptTermsError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [status, setStatus] = useState<IApiStatus|null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  
  const handleAcceptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAcceptTerms = event.target.checked;
    setAcceptTerms(newAcceptTerms);
    const validationError = validateAcceptTerms(newAcceptTerms);
    setAcceptTermsError(validationError);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    const validationError = validateEmail(newEmail);
    setEmailError(validationError);
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
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
  };

  async function handleSubmit(event: React.FormEvent)  {
    event.preventDefault();
    setAcceptTermsError(validateAcceptTerms(acceptTerms));
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
    setUsernameError(validateUsername(username));
    const ok = (emailError === '' && passwordError === '' && 
                usernameError === '' && acceptTerms);
    if (!ok) {
      return;
    }
    try {
      setIsLoading(true);
      const newStatus = await addUser(username, email, password, acceptTerms);
      setStatus(newStatus);
      setIsStatusOpen(true);
      }
    finally {
      setIsLoading(false);
    }    
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    const validationError = validateUsername(newUsername);
    setUsernameError(validationError);
  };

  const onCloseStatusDialog = () => {
    setIsStatusOpen(false);
    if (status?.success) {
      setUsername('');
      setEmail('');
      setPassword('');
      setAcceptTerms(false);
      setStatus(null);
      onClose();
    }
  }
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
    {isLoading && <Loading centre={true}/> }
    <div style={topStyle}>
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
    <div className='modal-box'>
      <h2 className='font-bold text-lg'>Register New User</h2>
      <CloseButton onClose={onClose} />
      <p className='label-text text-right'><b>*</b>  Required</p>

      <form>
      <div className='form-control'>
        <label className='label' htmlFor='register_username'>
          <span className='label-text'>Username <b>*</b> (<i>visible to other users</i>)</span> 
          {(usernameError) && <span className={errorClass}>{usernameError}</span>}
        </label>
        <input type='text' autoComplete='username' id='register_username' 
          className='input input-bordered' 
          placeholder= 'Enter username' value={username} 
          onChange={handleUsernameChange} required />
      </div>

      <div className='form-control'>
        <label className='label' htmlFor='register_email'>
          <span className='label-text'>Email <b>*</b> </span>
          {(emailError) && <span className={errorClass}>{emailError}</span>}
        </label>
        <input type='text' autoComplete='email' id='register_email' 
          className='input input-bordered' 
          placeholder= 'Enter email' value={email} 
          onChange={handleEmailChange} required />
      </div>

      <div className='form-control'>
        <label className='label' htmlFor='register_password'>
          <span className='label-text'>Password <b>*</b> </span>
          {(passwordError) && <span className={errorClass}>{passwordError}</span>}
        </label>
        <div className='relative'>
          <input type={isPasswordVisible ? 'text' : 'password'}
            autoComplete='new-password' id='register_password' 
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

      <div className='form-control'>
        <label className='cursor-pointer label justify-start'>
          <input type='checkbox' className='checkbox checkbox-primary mr-2' 
            onChange={handleAcceptChange} required />
          <span>I agree to the <a href={termsUrl} target='_blank' className='link link-primary'>
            Terms and Conditions</a> *</span>
        </label>
        {(acceptTermsError) && <span className={errorClass}>{acceptTermsError}</span>}
      </div>

      <div className='modal-action'>
        <button type='button' className='btn' onClick={onClose}>Cancel</button>
        <button type='submit' className={'btn btn-primary'}
          onClick={handleSubmit}>Register</button>
      </div>
      </form>

      {isStatusOpen && status && 
          <StatusMessage status={status} onClose={onCloseStatusDialog} />}

    </div>
  </div>
  </div>
  </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
