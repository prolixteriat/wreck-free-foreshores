
// -----------------------------------------------------------------------------

export interface IFormProps {
  isOpen: boolean;
  onClose: () => void;
}
// -----------------------------------------------------------------------------

export const validateAcceptTerms = (accept: boolean): string => {
    const msg = accept ? '' : 'Please review and accept the Terms and Conditions';
    return msg;
};
// -----------------------------------------------------------------------------

export const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const msg = emailRegex.test(email) ? '' : 'Invalid email address';
    return msg;
};
// -----------------------------------------------------------------------------

export const validatePassword = (password: string): string => {
    const lengthRegex = /.{8,}/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    if (!lengthRegex.test(password)) {
      return 'Password must be at least 8 characters long';
    }
    if (!upperCaseRegex.test(password)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!lowerCaseRegex.test(password)) {
      return 'Password must contain at least 1 lowercase letter';
    }
    if (!numberRegex.test(password)) {
      return 'Password must contain at least 1 number';
    }
    return '';
};
// -----------------------------------------------------------------------------

export const validateUsername = (username: string): string => {
    
    if (username.length < 3) {
        return 'Minimum 3 characters';
    }
    if (username.length > 10) {
      return 'Maximum 10 characters';
    }    
    if (username.includes('@')) {
        return 'Must not contain @ character';
    }    

    return '';
  };
  // -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
