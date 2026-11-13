import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Dev-only: POST a canvas dataURL to /__snap?name=x to save ../previews/r3f-x.png.
// Used to save verification screenshots; not part of any build.
function snapPlugin(): Plugin {
  return {
    name: 'harbor-snap',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__snap', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        const url = new URL(req.url ?? '', 'http://localhost');
        const name = (url.searchParams.get('name') ?? 'shot').replace(/[^a-z0-9-]/gi, '');
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          const b64 = body.replace(/^data:image\/png;base64,/, '');
          const dir = resolve(__dirname, '../previews');
          mkdirSync(dir, { recursive: true });
          const file = resolve(dir, `r3f-${name}.png`);
          writeFileSync(file, Buffer.from(b64, 'base64'));
          res.end(file);
        });
      });
    },
  };
}

export default defineConfig({ plugins: [react(), snapPlugin()] });
