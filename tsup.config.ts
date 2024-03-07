import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    entry: ["src/**"],
    format: ["cjs"],
    shims: true,
    skipNodeModulesBundle: true,
});