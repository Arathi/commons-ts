import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 30327
    },
    build: {
        lib: {
            entry: './src/TmUsCommons.ts',
            name: 'TmUsCommons',
            formats: ['umd'],
            fileName: "commons"
        },
        outDir: "./dist",
        sourcemap: true,
    }
});