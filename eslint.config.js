import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    // Files this config applies to
    files: ['**/*.{js,mjs,cjs,vue}'],
  },
  {
    // Don't lint generated/build output
    ignores: ['dist/**', 'node_modules/**', 'public/catalog/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Relax a couple of stylistic Vue rules to match existing code;
      // tighten these once the codebase is fully aligned.
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
    },
  },
]