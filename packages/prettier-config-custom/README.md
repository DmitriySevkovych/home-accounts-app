# Customized `Prettier` configurations for this project 

## Usage and Extension

The custom configuration is referenced in the root [`package.json`](../../package.json) of the monorepo, cf. key `"prettier": ...`.

The configuration can be extended and/or overwritten. For example, see [the configuration in the frontend app](../../apps/frontend/.prettierrc.js).

## Useful commands

To use prettier from the CLI, run 
```
# For a single file
npx prettier --check apps/frontend/src/components/TagsManager.tsx
npx prettier --write apps/frontend/src/components/TagsManager.tsx
npx prettier --list-different apps/frontend/src/components/TagsManager.tsx

# For multiple files, e.g.
npx prettier --check apps/frontend/
npx prettier --write .
```