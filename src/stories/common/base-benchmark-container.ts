import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { waitForDoubleRaf } from '../../testing/perf-tracker';

/**
 * Abstract base class for benchmark smart container components.
 * Standardizes host bindings, size event listeners, race-condition guarding,
 * and double-rAF paint readiness notification.
 */
@Directive({
  host: {
    '[attr.data-ready]': 'isReady',
    '[attr.aria-busy]': '!isReady',
  },
})
export abstract class BaseBenchmarkContainerComponent<T = unknown>
  implements OnInit, OnDestroy
{
  protected readonly cdr = inject(ChangeDetectorRef);

  @Input() set datasetSize(value: number) {
    const size = Math.max(0, Math.floor(Number(value) || 0));
    if (size !== this.size) {
      this.size = size;
      this.regenerateData(size);
    }
  }

  size = -1;
  isReady = false;

  private generationId = 0;
  private listenerCleanup?: () => void;

  /** Name used to listen for window:storybook-<componentName>-size events */
  protected abstract readonly componentName: string;

  /** Generates the raw dataset for the given size */
  protected abstract generateDataset(size: number): Promise<T[]>;

  /** Handles the newly generated data (e.g. assigning to rows/items) */
  protected abstract onDataGenerated(data: T[]): void;

  ngOnInit(): void {
    const eventName = `storybook-${this.componentName}-size`;
    const handler = (event: Event) => {
      const size = (event as CustomEvent<{ size?: number }>).detail?.size;
      if (typeof size === 'number') {
        this.size = Math.max(0, Math.floor(Number(size) || 0));
        this.regenerateData(this.size);
      }
    };
    window.addEventListener(eventName, handler);
    this.listenerCleanup = () => window.removeEventListener(eventName, handler);

    if (this.size < 0) {
      this.size = 0;
      this.regenerateData(0);
    }
  }

  ngOnDestroy(): void {
    this.listenerCleanup?.();
  }

  protected async regenerateData(size: number): Promise<void> {
    this.isReady = false;
    this.cdr.markForCheck();
    const currentGenId = ++this.generationId;

    const data = size > 0 ? await this.generateDataset(size) : [];

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
