import type { Meta, StoryObj } from '@storybook/react';

import { ComponentWrapper } from '../ComponentWrapper';

// -----------------------------------------------------------------------------

const meta = {
    title: 'ComponentWrapper',
    component: ComponentWrapper,
    parameters: {
        // layout: 'centered',
    },
    // tags: ['autodocs'],
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    args: { 
        // onClose: fn() 
    },
} satisfies Meta<typeof ComponentWrapper>;

// -----------------------------------------------------------------------------

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------

export const BoatGallery: Story = {
    args: {
        component: 'BoatGallery'
    },
}
// -----------------------------------------------------------------------------

export const LocationPicker: Story = {
    args: {
        component: 'LocationPicker'
    },
}
// -----------------------------------------------------------------------------

export const RankingsTable: Story = {
    args: {
        component: 'RankingsTable'
    },
}
// -----------------------------------------------------------------------------

export const WrecksCharts: Story = {
    args: {
        component: 'WrecksCharts'
    },
}
// -----------------------------------------------------------------------------

export const WrecksMap: Story = {
    args: {
        component: 'WrecksMap'
    },
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------



  