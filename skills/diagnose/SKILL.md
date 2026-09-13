---
name: diagnose
description: Disciplined diagnosis for hard bugs and regressions. Red loop, minimise, hypothesise, instrument, fix, regression check. Use when the cause is unknown, or a fix without repro was proposed.
---

# Diagnose

## Steps

1. Build a feedback loop that goes **red** on this bug. If you cannot, you cannot diagnose yet.
2. Minimise the input that keeps it red.
3. Hypotheses from evidence. Rank. Do not fix yet.
4. Instrument to kill hypotheses. Measured.
5. One cause. Fix at the cause. **tdd** a regression check.
6. If two fixes sharing a premise already failed, question the premise.

**Done when** the red loop is green for the original report and the regression check exists.
