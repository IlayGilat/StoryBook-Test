import type { Meta, StoryObj } from '@storybook/angular';

import { PaginationComponent } from './pagination.component';
import '../../testing/perf-tracker';

const meta: Meta<PaginationComponent> = {
  title: 'Performance/Pagination',
  component: PaginationComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    totalItems: { control: { type: 'number', min: 0, max: 100000, step: 100 } },
    pageSize: { control: { type: 'number', min: 1, max: 100, step: 1 } },
    currentPage: { control: { type: 'number', min: 1, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<PaginationComponent>;

export const Stress: Story = {
  args: { totalItems: 1000, pageSize: 25, currentPage: 1 },
};