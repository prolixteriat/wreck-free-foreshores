import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { default as LogoutForm } from './LogoutForm';

// -----------------------------------------------------------------------------

const meta = {
    title: 'UserForms/LogoutForm',
    component: LogoutForm,
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
} satisfies Meta<typeof LogoutForm>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

export const Default: Story = {
    args: {
        isOpen: true,
    },
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  