## StoryBook-Test

Angular and Storybook performance test project.

## Development

```text
npm install
npm start
npm run storybook
```

## Validation

```text
npm run build
npm test -- --watch=false
```

The performance workflow builds Storybook once and runs the pagination and table suites one at a time with a single Playwright worker:

```text
npm run test:perf
npm run test:perf:headed
```

Generated Storybook files are written to `.artifacts/storybook-static`. Playwright results are written to `.artifacts/test-results`; both locations are ignored by Git.
