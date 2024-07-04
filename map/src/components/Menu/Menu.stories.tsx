import type { Meta, StoryObj } from '@storybook/react';

import { default as Menu } from './Menu';

// -----------------------------------------------------------------------------

const meta = {
    title: 'Menu',
    component: Menu,
    parameters: {
        layout: 'centered',
    },
    // tags: ['autodocs'],
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    args: { 
        // onClose: fn() 
    },
} satisfies Meta<typeof Menu>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

export const Default: Story = {
    args: {
        
    },
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  