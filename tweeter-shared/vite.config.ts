import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'tweeterShared',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [dts()],
});
