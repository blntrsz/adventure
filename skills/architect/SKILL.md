---
name: architect
description: Sketch types, signatures, and module shape at a seam before implementation. Use when code will cross a function boundary, or jumping to code would lock the wrong shape.
---

# Architect

## Steps

1. Name the seam and the consumer of the interface.
2. Sketch the data shape first. Encode rules in the type or structure, not in scattered conditionals.
3. Small interface, deep module. List operations the caller needs. Hide the rest.
4. If two shapes are plausible, sketch both. Pick with a reason. Prototype if empirical.
5. Stay in the loop while `/build` fills the sketch. Drift from the sketch is a new decision, not a silent edit.

**Done when** a implementer can fill the module through the sketched interface without inventing types.
