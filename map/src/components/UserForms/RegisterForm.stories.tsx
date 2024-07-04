import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { default as RegisterForm } from './RegisterForm';

// -----------------------------------------------------------------------------

const meta = {
    title: 'UserForms/RegisterForm',
    component: RegisterForm,
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
} satisfies Meta<typeof RegisterForm>;

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



  