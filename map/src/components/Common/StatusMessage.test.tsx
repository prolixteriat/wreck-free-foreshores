import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { IApiStatus } from '../../lib/poster';

import { StatusMessage } from './StatusMessage';

// -----------------------------------------------------------------------------

const makeApiStatus = (success: boolean, message: string): IApiStatus => {
    return {
        success,
        message,
    };
};
// -----------------------------------------------------------------------------

const mockOnClick = vi.fn();

const TestComponent = () => (
        <StatusMessage
            status={makeApiStatus(true, 'This is a success message')}
            onClose={mockOnClick}
        />
    );
// -----------------------------------------------------------------------------
    
test('should call the onClose function when the close button is clicked', () => {
    render(<TestComponent />);
    // screen.debug();
    const button = screen.getByText('Close');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
});
// -----------------------------------------------------------------------------
  
test('should display a success message', () => {
    render(<TestComponent />);
    const div = screen.getByText('This is a success message', {exact: false});    
    expect(div).toBeDefined;
});
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
