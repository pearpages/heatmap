import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],       // main entry point
  format: ["esm"],         // build both module types
  dts: true,                      // generate .d.ts types
  sourcemap: true,                // useful for debugging
  clean: true,                    // clear dist before build
  treeshake: true,                // remove unused code
  target: "es2022",               // modern JS output
  external: ["react", "react-dom"], // keep as peer deps
  esbuildOptions(options) {
    // Configure loaders for different file types
    options.loader = {
      ...options.loader,
      '.scss': 'css',
    }
  }
});
