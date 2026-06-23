// import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// export default defineConfig({
//   tanstackStart: {
//     // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
//     // nitro/vite builds from this
//     server: { entry: "server" },
//   },
// });


import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite' // <-- Ubah baris ini
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // <-- Jalankan fungsi ini
    react(),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [
      '@tanstack/start',
      '@tanstack/react-start',
      '@tanstack/start-server-core',
      '@tanstack/react-router'
    ]
  }
})