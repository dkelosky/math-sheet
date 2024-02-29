#

## Dev

For now easiest to do `npx tsc --watch` and `npx webpack --watch`.  Webpack looks at the lib folder.  It should would with webpack alone but is too difficult.

`npx tsc` outputs `*.mjs` files to a `lib` folder.  However, we can take `npx webpack` to output files from typescript to `dist` folder.

For now, `lib` folder will not be used.