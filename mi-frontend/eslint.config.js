import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // Deshabilitar la regla que requiere importar React en cada archivo
      'react/react-in-jsx-scope': 'off',

      // Reglas para prop-types (si estás usando prop-types)
      'react/prop-types': 'error', // Asegura que todas las props estén validadas
      'react/require-default-props': 'warn', // Avisa si falta un valor por defecto para las props opcionales

      // Otras reglas personalizadas
      'react/jsx-no-target-blank': 'off', // Deshabilitar la regla que prohíbe target="_blank"
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];