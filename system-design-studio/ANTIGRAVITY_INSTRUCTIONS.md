# ANTIGRAVITY_INSTRUCTIONS.md
Put this file at the project root. Reference it explicitly in every prompt you give the agent
("read ANTIGRAVITY_INSTRUCTIONS.md and system_design_spec.json before doing anything").

## Why the previous attempt failed

Agentic IDEs lose fidelity when you hand them a long prose spec (18 sheets, hundreds of
formulas, in English paragraphs) in one shot and ask for a finished app. Two things go wrong:
1. **It cannot reliably parse an .xlsx itself.** Binary spreadsheet files are not something the
   model reads formula-by-formula — it guesses. That's why calculations came out wrong or static.
2. **One giant prompt exceeds what a single agent turn can verify.** It writes plausible-looking
   code for sheet 1, drifts by sheet 5, and never checks its numbers against ground truth.

The fix is not a better prompt — it's a better **input format** plus **staged, verifiable steps**.

## What's different this time

I've extracted the workbook into two machine-readable JSON files that sit next to this one:

- `named_ranges.json` — every input, its default value, and where it lived in Excel (126 entries)
- `system_design_spec.json` — every calculated metric, grouped by sheet, in dependency order,
  with THREE things per formula: the original Excel formula, a best-effort JS-translated
  expression, and the actual numeric value Excel computed at default inputs. That last field is
  your ground truth for testing — an agent (or you) can `npm test` against it.

This is not prose the model has to interpret — it's structured data it can loop over
mechanically. Feed the agent the JSON, not the paragraph description.

## How to drive Antigravity, step by step

Do NOT paste one mega-prompt and walk away. Run it as a sequence of small tasks, each with a
verification gate before you move to the next. Suggested sequence:

### Step 0 — Ingestion (one task, no code yet)
> "Read `system_design_spec.json` and `named_ranges.json` in full. Do not write any code yet.
> Summarize back to me: (a) the anchor calculation chain, (b) how many sheets/calculation groups
> exist, (c) which calculated values are referenced by other calculated values (cross-sheet
> dependencies), and (d) any formula you are not fully confident you can translate to JavaScript.
> Flag ambiguities now, before we build anything."

Do not proceed until its summary matches what you expect (DAU→PCU→Raw_RPS→Peak_RPS as the
anchor chain, ~125 calculated metrics across 13 calculation sheets, etc). If it hallucinates or
misses sheets, that tells you it didn't actually read the file — make it re-read and re-summarize
before continuing.

### Step 1 — Derivation engine only, no UI
> "Using ONLY `system_design_spec.json`, generate `lib/inputs.ts` (the input shape + defaults
> from `named_ranges.json`) and `lib/derivations.ts` — one pure function per calculated metric,
> named after its `step` label, implementing the `js_expression` field for each entry. Do not
> hand-simplify or 'improve' any formula — implement exactly what's in the spec. Then generate
> `lib/derivations.test.ts` using Vitest: for every entry in the spec, call the corresponding
> function with the default inputs and assert the result equals `computed_value_at_defaults`
> (use `toBeCloseTo` for floats). Run the tests and show me the output. Every test must pass
> before you write a single React component."

This is the gate. If Peak_RPS doesn't compute to ~6,666.67 here, nothing downstream will be
right either, and you've caught it in one small, cheap-to-fix file instead of a whole app.

### Step 2 — Scenario engine
> "Add the scenario override table from `system_design_spec.json` → `meta.scenario_table`.
> Write a test that switches to 'Black Friday' and asserts Peak_RPS increases proportionally
> (~41,667) and re-derives every downstream metric with no manual re-wiring. Show me the test
> output before continuing."

### Step 3 — One real screen, end to end
> "Now build ONLY the '02_User_Metrics' screen: the funnel visual, the calc table pulling live
> from `lib/derivations.ts`, and the `<Metric>` hover-to-explain component (spec: formula_text +
> js_expression substituted with live values + notes field as the explanation). Wire it to the
> Zustand store. Do not touch any other screen yet."

Check this screen in the browser yourself before continuing. Only once it's right, say:

> "Good. Now repeat the same pattern for every remaining sheet in
> `calculations_by_sheet`, one sheet per response, verifying against its own tests before moving
> to the next. Tell me which sheet you're doing before you start it."

### Step 4 — Tables, charts, diagrams
Only after every sheet's numbers are verified, layer on:
- React Table comparison views (scenario comparison table iterates the scenario engine from Step 2
  for all 5 scenarios and diffs the results — this needs zero new formulas, just re-running Step 2's
  function five times)
- Recharts visuals
- Mermaid diagram generation (its edge labels should literally interpolate values already produced
  by `lib/derivations.ts` — do not let the agent invent a second calculation path for diagram labels)
- React Flow whiteboard (this is pure UI, no calculation dependency — safe to build any time,
  but do it last so it doesn't distract from getting the numbers right first)

## Rules to repeat in every single prompt to the agent

1. "Read `system_design_spec.json` before writing code that touches calculations."
2. "Never hardcode a computed number — every derived value must come from `lib/derivations.ts`."
3. "If a formula is ambiguous, ask me — do not guess and silently proceed."
4. "Run the relevant test file and show me the output before telling me a step is done."
5. "One sheet / one feature per task. Do not attempt the whole app in one response."

## Files in this bundle

- `system_design_spec.json` — the full machine-readable formula + dependency spec (ground truth)
- `named_ranges.json` — raw input defaults (subset also embedded in the spec)
- `calculations.json` — flat list version of the same calc entries (useful for quick grep/debug)
- `ANTIGRAVITY_INSTRUCTIONS.md` — this file
- `antigravity_prompt.md` — the original feature/UX spec (screens, stack, React Flow/Mermaid asks).
  Use it for WHAT to build; use this file + the JSON for HOW to build it correctly.
