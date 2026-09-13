### Migrate

**Lane: eng.** Behaviour-preserving move to a new shape.

1. Name the target shape as if it had always existed. **subtract first** on the old path.
2. **architect** the seam. Callers migrate, then legacy deletes in one wave where possible.
3. Sequence verifiable units. Each unit keeps production up.
4. Prove dual-run or shadow if the risk warrants. Label inferred vs measured.
5. Gate includes rollback to the previous contract version.
6. **compound** the migration footgun if you hit one.

**Reply:** target shape, unit sequence, rollback, leftover legacy.
