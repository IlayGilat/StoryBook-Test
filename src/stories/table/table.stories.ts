import type { Meta, StoryObj } from '@storybook/angular';

import { TableComponent } from './table.component';
import '../../testing/perf-tracker';

const meta: Meta<TableComponent> = {
  title: 'Performance/Table',
  component: TableComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 10000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Stress: Story = {
  args: { datasetSize: 0 },
};
