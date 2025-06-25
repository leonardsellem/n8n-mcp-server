# Guidelines for Coding Agents

These rules apply to all automated contributors working on this project.

## Development
- Use **TypeScript** and ES modules. Source files live under `src/`.
- Place tests in the `tests/` directory mirroring the source structure. Test files must end with `.test.ts`.
- Install dependencies with `npm install` and build with `npm run build` when required.
- Format code using `npm run lint` and ensure all tests pass via `npm test` before committing.
- Do **not** commit files ignored by `.gitignore` (e.g. `node_modules/`, `build/`, `.env`).
- Follow existing patterns when adding new tools or resources as described in `docs/development`.

## Commit Messages
- Use short messages in the form `type: description` (e.g. `feat: add webhook tool`, `fix: handle null id`).

## Pull Requests
- Provide a concise summary of changes and reference related issues when opening a PR.
- CI must pass before requesting review.

## Environment
- Node.js 20 or later is required.

## Continuous Improvement
- After completing a task, review this guide and update it with any lessons
  learned about the codebase, coding principles, or user preferences.
