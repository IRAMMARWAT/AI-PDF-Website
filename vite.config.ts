import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    async configureServer(server) {
      try {
        const { apiRouter } = await import('./server/api.ts');
        server.middlewares.use('/api', (req, res, next) => {
          (apiRouter as any)(req, res, next);
        });
      } catch (err) {
        console.error('Failed to load apiRouter into Vite dev server:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
