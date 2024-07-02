import type { Meta, StoryObj } from '@storybook/react';

import { default as BoatGallery } from './BoatGallery';

// -----------------------------------------------------------------------------

const meta = {
    title: 'BoatGallery',
    component: BoatGallery,
    parameters: {
        layout: 'centered',
    },
    // tags: ['autodocs'],
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
} satisfies Meta<typeof BoatGallery>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

export const Primary: Story = {
    args: {
        ids: [2],
    },
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  