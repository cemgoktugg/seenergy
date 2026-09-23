---
name: visual-iterate
description: Repeatedly inspect reference and local screenshots, identify the highest-impact visual mismatch, apply a focused frontend change, run quality checks, and measure the new screenshot diff. Use for controlled visual convergence after the reference-clone analysis exists.
argument-hint: "[route-name] [maximum-iterations]"
user-invocable: true
---

# visual-iterate

A bounded convergence loop. Each pass fixes **one related group** of
differences, proves it with a measurement, and stops when the target is met or
the iteration budget runs out.

## Arguments

`$ARGUMENTS` may supply `[route-name] [maximum-iterations]`.

- `route-name` — a `name` from `visual.config.mjs` (`home`, `category`,
  `product`). Omitted → `home`.
- `maximum-iterations` — default **8**. Never exceed it.

## Preconditions

- `artifacts/visual/reports/reference-analysis.md` exists. If it does not, run
  `/reference-clone` first — iterating without an analysis is guessing.
- Reference baseline captured, local server running.

## The loop

Repeat until a stop condition fires.

### Before the change

1. Record the current diff percentage for the route at every viewport. This is
   `previous`. Read it from `artifacts/visual/reports/visual-diff.json` — do
   not remember it, read it.
2. Pick the **single largest related group** of differences. One group means
   one cause: "the header is 24px too tall and its nav is misaligned" is one
   group; "the header and the footer and the card radius" is three.

   Locate it rather than guessing at it:
   ```
   node scripts/visual/diff-hotspots.mjs --worst
   ```
   The top band is where the changed pixels actually are.
3. State the hypothesis in one sentence: what is wrong, and what you expect the
   percentage to do.

### The change

4. Apply the change. Prefer tokens over literals, existing components over new
   ones. Keep the diff small enough to attribute the result to it.
5. Never touch the user's uncommitted work. If you need to undo something,
   undo only what you wrote in this iteration.

### After the change

6. Run the fast checks:
   ```
   npm run quality:gate
   ```
   Lint and typecheck failures are fixed before any screenshot is taken.
7. Re-capture and measure:
   ```
   npm run visual:local
   npm run visual:compare
   npm run visual:report
   ```
8. Record the new percentage as `current`.

### Decide

| Outcome | Action |
| --- | --- |
| `current` < `previous` | Improvement. Continue to the next iteration. |
| `current` ≈ `previous` (within ±0.2pt) | The change did not address the cause. Try **at most one** alternative approach for the same group. If that also fails to move it, record the group as unresolved, explain why, and move to the next-largest group. |
| `current` > `previous` | Regression from your own edit. Inspect it, revert **your** change, and choose a different approach. Never revert the user's work to fix your own. |

## Stop conditions

Stop immediately when any of these is true:

- **Success** — every viewport for the route is at or below
  `THRESHOLDS.targetDiffPercent` (2%) **and** every critical band is inside its
  own limit. Stop early; do not keep polishing.
- **Budget** — the iteration count reaches the maximum. Stop and report.
- **Blocked** — the local server, the reference site or the toolchain is
  unavailable. Stop and say so.
- **Quality** — the gate fails and the cause is outside this task's scope.
  Report rather than paper over it.

Never loop without a decrementing counter. Never run "until it looks right".

## Build policy

- The fast gate (`npm run quality:gate`) runs **every** iteration.
- The production build (`npm run quality:full`) runs at **milestones only** —
  when a route reaches its target, or before you report completion. Running a
  full build after each CSS tweak wastes minutes per iteration and proves
  nothing the fast gate has not already proven.

## Reporting

At the end, always produce a per-route, per-viewport before/after table:

| Route | Viewport | Before | After | Target | Met |
| --- | --- | ---: | ---: | ---: | :---: |
| home | desktop-xl | 11.4% | 1.8% | 2% | yes |
| home | mobile | 14.2% | 3.6% | 2% | no |

Then list:

- what changed, grouped by cause
- what is still outstanding and the measured size of it
- anything you could not resolve, and why

## Definition of done

The task is **not** complete until:

- the target diff percentage is met for the route at every viewport, **or** the
  iteration budget is exhausted and the remaining gap is reported honestly;
- `npm run quality:gate` passes;
- `npm run quality:full` passes at the closing milestone;
- no test is failing and no check was skipped silently.

A passing screenshot with a failing test is not done.
