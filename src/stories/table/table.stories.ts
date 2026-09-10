import type { Meta, StoryObj } from '@storybook/angular';
import { TableContainerComponent } from './table-container.component';

const meta: Meta<TableContainerComponent> = {
  title: 'Performance/Table',
  component: TableContainerComponent,
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 10000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<TableContainerComponent>;

export const Stress: Story = {
  args: { datasetSize: 0 },
};
