# TypeScript configuration for the monorepo

TODO docs!

## Troubleshooting

- [TS cannot import things such as `somePackage/exportedFile`, problems with `exports` in package.json](https://github.com/microsoft/TypeScript/issues/51862)
    + **TLDR;** in the TS config use `"moduleResolution": "node16"` or `"moduleResolution": "nodenext"`