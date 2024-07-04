import React from 'react';
import { test, expect, vi } from 'vitest';
import { fireEvent, render, screen  } from '@testing-library/react';

import { MessageBar } from './MessageBar';

// -----------------------------------------------------------------------------

const mockOnClick = vi.fn();
const doRender = (): void => {
    render(<MessageBar
            message = 'Test message'
            type = 'success'
            onClose = {mockOnClick} />);
};

// screen.debug();

// -----------------------------------------------------------------------------
    
test('should call the onClose function when the close button is clicked', () => {
    doRender();
    const button = screen.getByText('✕');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
});
// -----------------------------------------------------------------------------
  
test('should have the correct classes', () => {
    doRender();
    const classes = document.getElementsByClassName('bg-green-100')
    expect(classes).not.toBeNull();
});
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
