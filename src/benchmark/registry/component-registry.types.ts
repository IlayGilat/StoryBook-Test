import type { BenchmarkComponent } from './component-registry.constants';

/** Identifiers derived from one registered benchmark component name. */
export interface BenchmarkIdentity {
  componentName: BenchmarkComponent;
  containerSelector: string;
  readySelector: string;
  sizeEventName: string;
  storyUrl: string;
}
