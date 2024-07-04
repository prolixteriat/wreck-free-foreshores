import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { default as LoginForm } from './LoginForm';

// -----------------------------------------------------------------------------

const meta = {
    title: 'UserForms/LoginForm',
    component: LoginForm,
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
} satisfies Meta<typeof LoginForm>;

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



  