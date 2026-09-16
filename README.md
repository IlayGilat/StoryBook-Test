## StoryBook-Test

Angular and Storybook performance test project.

## Development

```text
npm install
npm start
npm run storybook
```

## Project layout

```text
src/
├── components/
│   └── <component>/
│       ├── ui/          # Dumb Angular component and local view helpers
│       ├── data/        # Consolidated data contract and separate factory
│       ├── harness/     # Storybook container and story
│       └── test/        # Playwright spec, scenario, and interactions
└── benchmark/
    ├── browser/         # In-page performance tracking
    ├── data-generator/  # Shared dataset generation
    ├── harness/         # Shared Angular benchmark container
    ├── playwright/      # Benchmark execution and reporting
    └── registry/        # Component identities and derived selectors
```

## Validation

```text
npm run build
npm test
```

The performance workflow builds Storybook once and runs every component suite with a single Playwright worker:

```text
npm run test:perf
npm run test:perf:headed
```

Generated Storybook files are written to `.artifacts/storybook-static`. Playwright results are written to `.artifacts/test-results`; both locations are ignored by Git.
