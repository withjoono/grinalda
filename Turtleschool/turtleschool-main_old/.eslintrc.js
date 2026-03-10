module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
    //'next/core-web-vitals',
    'next',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    // strict: 0,
    // 'new-cap': 0,
    // 'require-jsdoc': 0,
    'no-unused-vars': 'warn',
    'import/no-anonymous-default-export': 'off',
    'react/react-in-jsx-scope': 'warn',
    'react/prop-types': 'warn',
    'react/jsx-key': 'warn',
    'react/display-name': 'warn',
    'react/jsx-no-duplicate-props': 'warn',
    'react-hooks/exhaustive-deps': 1,
    'react-hooks/rules-of-hooks': 1,
    'react/no-unknown-property': 'warn',
    'react/jsx-no-undef': 'warn',
    '@next/next/no-img-element': 'warn',
    '@next/next/link-passhref': 'warn',
    '@next/next/no-html-link-for-pages': 'warn',
    '@next/next/no-sync-scripts': 'warn',
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img'],
        img: ['Image'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: '/',
    },
    'import/internal-regex': '^next/',
  },
};
