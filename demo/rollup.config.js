import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json' assert { type: "json" };

export default [
	{
		input: 'demoControl.js',
		output: {
			name: 'bundle',
			file: 'bundle.js',
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs(),
			json()
		]
	}
];