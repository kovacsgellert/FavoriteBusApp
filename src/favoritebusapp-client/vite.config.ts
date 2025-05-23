import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Prefer Aspire-injected env, fallback to .env
  const apiUrl =
    env.services__api__https__0 ||
    env.services__api__http__0 ||
    env.VITE_API_URL;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: parseInt(env.VITE_PORT),
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: "./index.html",
      },
    },
  };
});
