# Copilot Instructions

## Commands

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm coverage          # Run tests with coverage
pnpm lint              # ESLint
pnpm tsc --noEmit      # Type-check
pnpm prettier --check src  # Check formatting
pnpm build             # Build CJS + ESM output to dist/
pnpm dev               # Watch build + sandbox Next.js app concurrently
pnpm sandbox dev       # Run the sandbox app only
```

Run a single test file:
```bash
pnpm vitest run src/index.test.ts
```

## Architecture

This is a pnpm monorepo:
- **Root** — the `react-input-formatting` npm library (`src/`)
- **`apps/sandbox`** — Next.js app for manual testing; imports the library via `workspace:*`

All library code lives in two files: `src/index.tsx` (implementation) and `src/types.ts` (interfaces). The entry point for the build is `src/index.tsx`.

Rollup produces dual output: `dist/cjs/` and `dist/esm/`, with `preserveModules: true`.

Releases are automated via `release-please` on push to `main`, which bumps the version and publishes to npm.

## Key Conventions

**Internal data model:**
- `raw` — a plain number string, always using `.` as decimal (e.g. `"1234.56"`)
- `formatted` — the display string with configured separators (e.g. `"1,234.56"`)
- `parsed` — a `number | undefined`; returns `undefined` for incomplete inputs like `""`, `"-"`, `"."`
- These three fields compose `InputState` and flow through all APIs

**API design — two usage patterns:**
1. **Direct exports** (`format`, `unformat`, `parse`, `formatInput`, `createInputState`, `useInputState`, `FormattedInput`) — use default separators (`,` thousands, `.` decimal)
2. **`createFormat(options)`** — factory that returns a bound object with the same API pre-configured for custom separators. Always validates that separators differ and neither is `"-"`.

**Caret position:** `formatInput` uses `requestAnimationFrame` to set the caret after React's render cycle. Tests that involve typing must use `{ delay: 30 }` in `userEvent.type` to wait for the RAF callback.

**Commits:** Conventional Commits are enforced by commitlint + Husky. Use `feat:`, `fix:`, `chore:`, etc.

**Lint-staged** runs Prettier, ESLint, and `tsc --noEmit` on staged `*.ts`/`*.tsx` files before each commit.
