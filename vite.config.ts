import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 30327,
        // open: "/dist/commons.umd.js"
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/TmUsCommons.ts'),
            name: 'TmUsCommons',
            formats: ['umd'],
            fileName: "commons"
        },
        outDir: "./dist",
        sourcemap: true,
    }
});