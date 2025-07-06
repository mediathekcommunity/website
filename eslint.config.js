import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			// Disable strict TypeScript rules for now
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'no-undef': 'off',
			'no-var': 'off',
			'prefer-const': 'off',
			'no-case-declarations': 'off',
			// Disable strict Svelte rules
			'svelte/require-each-key': 'off',
			'svelte/no-at-html-tags': 'off',
			'svelte/no-unused-svelte-ignore': 'off',
			'svelte/no-immutable-reactive-statements': 'off',
			'svelte/prefer-writable-derived': 'off'
		}
	},
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'src/lib/videojs/plugins/**',
			'src/lib/videojs/skins/**'
		]
	}
];
