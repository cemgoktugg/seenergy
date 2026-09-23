/**
 * eslint-config-next v16 ships native flat config, so it is spread directly.
 * FlatCompat is not used here — wrapping an already-flat config in the
 * eslintrc compatibility layer throws on this version.
 */
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'artifacts/**',
      'reference/**',
      'public/**',
      'scripts/**',
      'visual.config.mjs',
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
