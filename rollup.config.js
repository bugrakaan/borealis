import terser from '@rollup/plugin-terser';

const banner = `/**
 * Borealis - Interactive Animated Background
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`;

export default [
  // UMD build (for browsers and CommonJS)
  {
    input: 'src/borealis.js',
    output: {
      file: 'dist/borealis.js',
      format: 'umd',
      name: 'Borealis',
      banner,
      exports: 'default'
    }
  },
  // Minified UMD build
  {
    input: 'src/borealis.js',
    output: {
      file: 'dist/borealis.min.js',
      format: 'umd',
      name: 'Borealis',
      banner,
      exports: 'default',
      sourcemap: true
    },
    plugins: [terser()]
  },
  // ES Module build
  {
    input: 'src/borealis.js',
    output: {
      file: 'dist/borealis.esm.js',
      format: 'es',
      banner,
      exports: 'default'
    }
  }
];
