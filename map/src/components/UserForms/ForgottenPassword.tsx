import { useState } from 'react';

import { IApiStatus } from '@lib/poster';

import { Loading, StatusMessage } from '@components/Common';

import { CloseButton } from './common';
import { IFormProps } from './funcs';
import { passwordReset } from './callapi';

// -----------------------------------------------------------------------------

export function ForgottenPassword(props: IFormProps): React.JSX.Element {
    
  const { isOpen, onClose } = props;
  
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<IApiStatus|null>(null);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
    
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  async function handleSubmit(event: React.FormEvent)  {
    event.preventDefault();
    try {
      setIsLoading(true);
      const newStatus = await passwordReset(email);
      setIsLoading(false);
      // Mask the password reset message.
      newStatus.success = true;
      newStatus.message = 'Check your email for a link to reset your password. The link is valid for 1 hour.';
      setStatus(newStatus);
      setIsStatusOpen(true);
      } finally {
        setIsStatusOpen(true);
      }      
  }
  
  const onCloseStatusDialog = () => {
    setEmail('');
    setStatus(null);
    setIsStatusOpen(false);
    onClose();
  }

  return (
    <>
    {isLoading && <Loading centre={true}/> }
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
    <div className='modal-box'>
      <h2 className='font-bold text-lg'>Forgotten Password</h2>
      <CloseButton onClose={onClose} />
      
      <form>
        Enter your email address below. If the email address is registered with
        a user account, you will receive an email with link to reset your password.
      <div className='form-control'>
        <input type='text' id='forgot_email' 
          className='input input-bordered mt-2' 
          placeholder= 'Enter email' value={email} 
          onChange={handleEmailChange} required />
      </div>

      <div className='modal-action'>
          <button type='button' className='btn' onClick={onClose}>Cancel</button>
          <button type='submit' className={'btn btn-primary'}
            onClick={handleSubmit}>Reset</button>
      </div>
      </form>

      {isStatusOpen && status && 
          <StatusMessage status={status} onClose={onCloseStatusDialog} />}

    </div>
  </div>
  </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
