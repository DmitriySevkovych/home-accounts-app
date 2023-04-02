# Contributing Guidelines

## Domain-Driven Development

TODO

## Version Control (`git` Workflow)

TODO

## Styleguide (Code Formatting, etc.)

TODO

## Automated Testing

Frameworks/tools to be used for different kinds of tests:

-   Unit tests (backend and frontend) &rarr; `jest`
-   Integration tests backend &rarr; TODO: `jest`?
-   Integration tests frontend &rarr; `jest` + React `@testing-library`
-   E2E tests backend &rarr; TODO: ?!
-   E2E tests frontend &rarr; TODO: `cypress` or `playwright`? Or stick `@testing-library`?

### Unit Tests

Tests should be placed next to the tested file and named as `*.test.ts`.

### Integration Tests

#### Frontend

In order to retrieve components under test, the `data-testid` data attribute should be used. Cf. [this article](https://javascript.plainenglish.io/i-tested-a-react-app-with-jest-testing-library-and-cypress-here-are-the-differences-3192eae03850) form more information.
