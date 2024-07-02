import React from 'react';
import { test, expect, vi } from 'vitest';
import { fireEvent, render, screen  } from '@testing-library/react';

import { MessageBar } from './MessageBar';

// -----------------------------------------------------------------------------

const mockOnClick = vi.fn();
render(<MessageBar 
        message = 'Test message' 
        type = 'success'
        onClose = {mockOnClick} />
);
// screen.debug();

// -----------------------------------------------------------------------------
    
test('should call the onClose function when the close button is clicked', () => {
    const button = screen.getByText('✕');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
});
// -----------------------------------------------------------------------------
  
test('should have the correct classes', () => {

    const classes = document.getElementsByClassName('bg-green-100')
    expect(classes).not.toBeNull();
});
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
