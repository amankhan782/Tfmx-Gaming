import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink:'#090a0b', panel:'#111315', ember:'#f5a623' }, fontFamily:{ display:['Arial Narrow','Impact','sans-serif'] } } }, plugins:[] }; export default config;
