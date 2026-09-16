import type { Meta, StoryObj } from '@storybook/angular';
import { TreeGridContainerComponent } from './tree-grid.container';

const meta: Meta<TreeGridContainerComponent> = {
  title: 'Performance/Tree Grid',
  component: TreeGridContainerComponent,
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 10000, step: 50 } },
    pageSize: { control: { type: 'number', min: 1, max: 50, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<TreeGridContainerComponent>;

export const Stress: Story = {
  args: {
    datasetSize: 0,
    pageSize: 10,
  },
};

export const Populated: Story = {
  args: {
    datasetSize: 150,
    pageSize: 5,
  },
};
