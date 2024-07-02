import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { StatusMessage } from './StatusMessage';
import { IApiStatus } from '../../lib/poster';

// -----------------------------------------------------------------------------

const meta = {
    title: 'Common/StatusMessage',
    component: StatusMessage,
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
} satisfies Meta<typeof StatusMessage>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

const makeApiStatus = (success: boolean, message: string): IApiStatus => {
    return {
        success,
        message,
    };
};
// -----------------------------------------------------------------------------
// Stories
// -----------------------------------------------------------------------------

export const Success: Story = {
    args: {
        status: makeApiStatus(true, 'This is a success message'),
    },
}
// -----------------------------------------------------------------------------

export const Failure: Story = {
    args: {
        status: makeApiStatus(false, 'This is a failure message'),
    },
}

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  