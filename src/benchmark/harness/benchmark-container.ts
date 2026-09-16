import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { waitForDoubleRaf } from '../browser/performance-tracker';
import { BenchmarkComponent, getBenchmarkIdentity } from '../registry/component-registry';
import {
  EMPTY_DATASET_SIZE,
  UNINITIALIZED_DATASET_SIZE,
} from './benchmark-container.constants';
import {
  getGenerationErrorMessage,
  normalizeDatasetSize,
  readDatasetSizeEvent,
} from './benchmark-container.utils';

/**
 * Abstract base class for benchmark smart container components.
 * Standardizes host bindings, size event listeners, race-condition guarding,
 * and double-rAF paint readiness notification.
 */
@Directive({
  host: {
    '[attr.data-ready]': 'isReady',
    '[attr.aria-busy]': '!isReady',
    '[attr.data-error]': 'generationError',
  },
})
export abstract class BaseBenchmarkContainerComponent<T = unknown>
  implements OnInit, OnDestroy
{
  protected readonly cdr = inject(ChangeDetectorRef);

  @Input() set datasetSize(value: number) {
    const size = normalizeDatasetSize(value);
    if (size !== this.size) {
      this.size = size;
      this.regenerateData(size);
    }
  }

  size = UNINITIALIZED_DATASET_SIZE;
  isReady = false;
  generationError: string | null = null;

  private generationId = 0;
  private listenerCleanup?: () => void;

  /** Name used to listen for window:storybook-<componentName>-size events */
  protected abstract readonly componentName: BenchmarkComponent;

  /** Generates the raw dataset for the given size */
  protected abstract generateDataset(size: number): Promise<T[]>;

  /** Handles the newly generated data (e.g. assigning to rows/items) */
  protected abstract onDataGenerated(data: T[]): void;

  ngOnInit(): void {
    const eventName = getBenchmarkIdentity(this.componentName).sizeEventName;
    const handler = (event: Event) => {
      const size = readDatasetSizeEvent(event);
      if (size === undefined) return;
      this.size = size;
      this.regenerateData(size);
    };
    window.addEventListener(eventName, handler);
    this.listenerCleanup = () => window.removeEventListener(eventName, handler);

    if (this.size < 0) {
      this.size = EMPTY_DATASET_SIZE;
      this.regenerateData(EMPTY_DATASET_SIZE);
    }
  }

  ngOnDestroy(): void {
    this.listenerCleanup?.();
  }

  protected async regenerateData(size: number): Promise<void> {
    this.isReady = false;
    this.generationError = null;
    this.cdr.markForCheck();
    const currentGenId = ++this.generationId;

    let data: T[];
    try {
      data = size > 0 ? await this.generateDataset(size) : [];
    } catch (error) {
      if (currentGenId === this.generationId) {
        this.generationError = getGenerationErrorMessage(error);
        this.cdr.markForCheck();
      }
      return;
    }

    // Guard against stale generation results
    if (currentGenId !== this.generationId) return;

    this.onDataGenerated(data);
    this.cdr.markForCheck();

    // Wait for Angular change detection + browser paint completion
    await waitForDoubleRaf();

    // Final guard before marking ready
    if (currentGenId === this.generationId) {
      this.isReady = true;
      this.cdr.markForCheck();
    }
  }
}
