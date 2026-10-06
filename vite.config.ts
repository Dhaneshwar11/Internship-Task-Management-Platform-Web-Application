import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import JSZip from 'jszip';

function projectZipPlugin(): Plugin {
  return {
    name: 'project-zip-download-endpoint',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/download-zip' || url === '/api/download-zip/') {
          try {
            const zip = new JSZip();
            const rootDir = process.cwd();

            function addDirectory(currentDir: string, zipFolder: JSZip) {
              const files = fs.readdirSync(currentDir);
              for (const file of files) {
                if (
                  file === 'node_modules' ||
                  file === '.git' ||
                  file === 'dist' ||
                  file === '.cache' ||
                  file === '.env' ||
                  file === 'bun.lock' ||
                  file.startsWith('.vite')
                ) {
                  continue;
                }
                const filePath = path.join(currentDir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                  const subFolder = zipFolder.folder(file);
                  if (subFolder) {
                    addDirectory(filePath, subFolder);
                  }
                } else if (stat.isFile()) {
                  const fileData = fs.readFileSync(filePath);
                  zipFolder.file(file, fileData);
                }
              }
            }

            addDirectory(rootDir, zip);

            const buffer = await zip.generateAsync({
              type: 'nodebuffer',
              compression: 'DEFLATE',
              compressionOptions: { level: 6 },
            });

            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="heloix-workhub-platform.zip"',
              'Content-Length': buffer.length,
            });
            res.end(buffer);
            return;
          } catch (err) {
            console.error('Error generating project zip:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to generate project zip' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), projectZipPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
