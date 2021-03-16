# Testing

## Overview

The testing of our application will ensure its uptime across the whole stack. In light of this, the chosen framework that will be
used for testing the client and server side will be `jest`. The reason we have went with writing our tests in `jest` is because it
is probably the most widely used Javascript testing framework and that we want our CI to be short and simple.

## TDD & Directory Structure

Our tests will be held in a `__tests__` folder and our application will host only two of these folders. We have decided keep the tests
for the `client` side in the `client/src/__tests__` folder and the tests for the `server` side in the `server/src/__tests__` folder. All
tests will be written using `jest` on the client and server side. The client side will also use the `React Testing Library` to write
tests for React components directly.

## Continuous Integration

Our CI has already been implemented and is up and may be viewed [here](https://github.com/csc302-fall-2020/proj-6ix/pull/12). We used Github
Actions for it since it integrates directly with Github's Actions tab, works with our PRs directly, and shows linting and other errors inline.
With our CI/CD integration, PR commits are analyzed in real-time and any PRs that are merged with master will be deployed automatically.
