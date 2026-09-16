import { BenchmarkComponent } from './component-registry.constants';
import type { BenchmarkIdentity } from './component-registry.types';

/** Derives every harness identifier from the registered component name. */
export function getBenchmarkIdentity(componentName: BenchmarkComponent): BenchmarkIdentity {
  const containerSelector = `storybook-${componentName}-container`;

  return {
    componentName,
    containerSelector,
    readySelector: `${containerSelector}[data-ready="true"]`,
    sizeEventName: `storybook-${componentName}-size`,
    storyUrl: `/iframe.html?id=performance-${componentName}--stress&viewMode=story`,
  };
}
