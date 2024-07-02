import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { MessageBar } from './MessageBar';

// -----------------------------------------------------------------------------

const meta = {
    title: 'Common/MessageBar',
    component: MessageBar,
    parameters: {
        layout: 'centered',
    },
    // tags: ['autodocs'],
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    args: { 
        onClose: fn() 
    },
} satisfies Meta<typeof MessageBar>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

export const Info: Story = {
    args: {
        title: 'This is an Info Message',
        message: 'This is an info message bar',
        type: 'info',
    },
}
// -----------------------------------------------------------------------------

export const Success: Story = {
    args: {
        title: 'This is a Success Message',
        message: 'This is a success message bar',
        type: 'success',
    },
}
// -----------------------------------------------------------------------------

export const Warning: Story = {
    args: {
        message: 'This is a warning message bar without a title',
        type: 'warning',
    },
}
// -----------------------------------------------------------------------------

export const Error: Story = {
    args: {
        message: 'This is an error message bar without a title',
        type: 'error',
    },
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  