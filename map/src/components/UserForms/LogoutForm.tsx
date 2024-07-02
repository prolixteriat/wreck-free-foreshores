import { useContext } from 'react';

import { topStyle, WrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';

import { CloseButton } from './common';
import { IFormProps } from './funcs';

// -----------------------------------------------------------------------------

export default function LogoutForm(props: IFormProps): React.JSX.Element {
    
  const { isOpen, onClose } = props;
  
  const context = useContext(WrecksContext);

  async function handleSubmit()  {
    new JwtManager().logOut();
    context?.setMutate(context?.mutate+1);
    onClose();
  }

  return (
    <div style={topStyle}>    
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
    <div className='modal-box'>
      <h2 className='font-bold text-lg'>Logout</h2>
      <CloseButton onClose={onClose} />
      <br />
      <p>Are you sure you want to logout?</p>

      <div className='modal-action'>
        <button type='button' className='btn' onClick={onClose}>Cancel</button>
        <button type='submit' className={'btn btn-primary'} 
          onClick={handleSubmit}>Logout</button>
      </div>

    </div>
  </div>
  </div>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
