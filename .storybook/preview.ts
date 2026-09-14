import type { Preview } from '@storybook/angular';
import '../src/testing/perf-tracker';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;