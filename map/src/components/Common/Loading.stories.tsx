import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from './Loading';

// -----------------------------------------------------------------------------

const meta = {
    title: 'Common/Loading',
    component: Loading,
    parameters: {
        // layout: 'centered',
    },
    // tags: ['autodocs'],
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    args: { 
    },
} satisfies Meta<typeof Loading>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------
// Stories
// -----------------------------------------------------------------------------

export const Default: Story = {
    args: {
    },
}
// -----------------------------------------------------------------------------

export const Centered: Story = {
    args: {
        centre: true,
    },
}

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  