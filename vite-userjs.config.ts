import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "test/test.ts"),
            name: "TmUsCommonsTests",
            formats: ["umd"],
            fileName: "commons-test.user"
        },
        outDir: "./userscripts",
        sourcemap: true
    }
});