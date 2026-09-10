import type { Meta, StoryObj } from '@storybook/angular';
import { PaginationContainerComponent } from './pagination-container.component';

const meta: Meta<PaginationContainerComponent> = {
  title: 'Performance/Pagination',
  component: PaginationContainerComponent,
  argTypes: {
    totalItems: { control: { type: 'number', min: 0, max: 100000, step: 100 } },
    pageSize: { control: { type: 'number', min: 1, max: 100, step: 1 } },
    currentPage: { control: { type: 'number', min: 1, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<PaginationContainerComponent>;

export const Stress: Story = {
  args: { totalItems: 0, pageSize: 25, currentPage: 1 },
};