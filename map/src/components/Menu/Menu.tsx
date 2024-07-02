import { useContext, useState } from 'react';

import { homeUrl } from '@lib/config';
import { WrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';

import { LoginForm, LogoutForm, RegisterForm } from '@components/UserForms';

import { getTitle } from './funcs';

// -----------------------------------------------------------------------------

export default function Menu(): React.JSX.Element {
    
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  
  const jwt = new JwtManager();
  const username = jwt.getUsername();
  const logoutText = 'Logout' + ((username.length > 0) ? ` (${username})` : '');  const context = useContext(WrecksContext);

  const handleLoginClick = () => {
    const oldValue = showLogin;
    setShowLogin(!oldValue);
  }

  const handleLogoutClick = () => {
    const oldValue = showLogout;
    setShowLogout(!oldValue);
  }

  const handleRegisterClick = () => {
    const oldValue = showRegister;
    setShowRegister(!oldValue);
  }

  const onCloseLogin = () => setShowLogin(false);
  const onCloseLogout = () => {
    context?.useWrecks.mutate!();
    setShowLogout(false);
  }
  const onCloseRegister = () => setShowRegister(false);

  return ( 
    <>
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a href={homeUrl} 
          className='btn btn-ghost text-normal md:text-xl'>
            {getTitle()}
        </a>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          {jwt.isLoggedOut() &&
            <li><a href='#' onClick={handleRegisterClick}>Register</a></li>
          }
          {jwt.isLoggedIn() ?
            <li><a onClick={handleLogoutClick}>{logoutText}</a></li> :
            <li><a onClick={handleLoginClick}>Login</a></li>
          }
        </ul>
      </div>
    </div>
    {<LoginForm isOpen={showLogin} onClose={onCloseLogin} />}
    {<LogoutForm isOpen={showLogout} onClose={onCloseLogout} />}
    {<RegisterForm isOpen={showRegister} onClose={onCloseRegister} />}
    </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
