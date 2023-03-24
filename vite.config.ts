import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
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


