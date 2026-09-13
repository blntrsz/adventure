---
name: tdd
description: Red-green-refactor at a named seam. Failing behaviour check first, then the fix, then clean. Use when implementing a tracer, fixing a bug with a cheap local test, or build calls for TDD.
---

# TDD

One vertical slice at a time.

## Steps

1. Name the seam and the behaviour. Call the code the way its users do. Assert a literal expected value.
2. Write a check that fails for the right reason. Show the red.
3. Smallest change to green.
4. Refactor without adding behaviour. Subtract duplication.
5. Repeat. Do not batch several reds.

A test that would still pass if every imported function returned `undefined` is not a test. Delete or rewrite it.

**Done when** the slice's behaviour is green and the test names the behaviour, not the implementation.
