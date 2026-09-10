import type { Meta, StoryObj } from '@storybook/angular';

import { TreeGridComponent } from './tree-grid.component';
import '../../testing/perf-tracker';

const meta: Meta<TreeGridComponent> = {
  title: 'Performance/Tree Grid',
  component: TreeGridComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 10000, step: 50 } },
    pageSize: { control: { type: 'number', min: 1, max: 50, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<TreeGridComponent>;

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

