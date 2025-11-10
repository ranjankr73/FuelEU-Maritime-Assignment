import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/routes": "http://localhost:3000",
            "/compliance": "http://localhost:3000",
            "/banking": "http://localhost:3000",
            "/pools": "http://localhost:3000",
        },
    },
});
