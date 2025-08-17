# Gemini Agent Instructions

This document provides instructions for the Gemini agent to interact with the `pokemon-dnd-companion` project.

## Project Overview

This is a Next.js application designed to be a companion for a Pokemon Dungeons and Dragons campaign. It helps players and game masters manage Pokemon, trainers, and other game-related data.

## Development

To run the development server, use the following command:

```bash
npm run dev
```

## Testing
### Testing Standards
- All new features and modifications must be accompanied by tests.
- Tests should cover both the functionality and edge cases.
- Use Jest for unit and integration tests.
- Do not mock components in tests unless absolutely necessary. Instead, use the actual components to ensure realistic testing.
- Never  mock Zustand store in tests. Use the actual Zustand store to ensure realistic testing.
- Never use snapshot tests. Instead, write tests that check the actual behavior of the components and functions. If you encounter a snapshot test, refactor it to a more appropriate test that checks the actual behavior, after confirming with the user that the snapshot test is not needed.
- Ensure that all tests pass before committing any changes.
### Querying DOM
When querying the DOM in tests, use the following methods, with the following priorities:
- Use `getByRole` to find elements by their role.
- Use `getByText` to find elements by their text content.
- Use `getByTestId` to find elements by their `data-testid` attribute.
- Use `queryByText` and `queryByRole` for assertions that may not find an element, allowing for more flexible tests.
If a test cannot be queried using getByRole, consider adding a role to the element in question to make it more accessible and easier to test. If there is no role that fits the element, use `getByText` or `getByTestId` as a fallback and add a data-test-id attribute to the element if necessary.

### Running Tests
To run the test suite, use the following command:

```bash
npm run test
```

To run the tests in watch mode, use:

```bash
npm run test:watch
```

To generate a test coverage report, use:
```bash
npm run test:coverage
```

## Linting

To lint the codebase, use the following command:

```bash
npm run lint
```

## Key Technologies

- **Next.js**: React framework for building the user interface.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Jest**: JavaScript testing framework.
- **Zustand**: State management library.

### Methodology
### Gathering Requirements
When a user requests a new feature or modification, first gather detailed requirements. Ask clarifying questions to ensure you understand the user's needs fully.
If the request is vague or lacks detail, ask for more information to clarify the requirements.
The request should have a documentation that is inside the doc folder. If the user provided it to you, gather feedback from the user and then apply the changes to that document.

If you need to add new features or modify existing ones, make a Plan in a todo list format.
Clearly state it to the user and ask for confirmation before proceeding with the implementation.

As soon as your implementation is complete, inform the user about the changes made and provide a brief summary of the modifications. Ask the user for manual check.
After the user confirms that everything works as expected, add tests that cover the new functionality or modifications made.
Then run the tests to ensure everything is functioning correctly.
After the tests pass, commit the changes with a clear and concise commit message that describes the modifications made.
Finally, inform the user that the changes have been successfully committed and provide a summary of the modifications.
