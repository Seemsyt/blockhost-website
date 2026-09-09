import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

export const handler = async (event) => {
  let rawPath = event.rawPath || '/';
  if (rawPath === '/') rawPath = '/index.html';
  
  let filePath = path.join(__dirname, 'dist', rawPath);
  
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error('Not a file');
  } catch (err) {
    // SPA fallback to index.html
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  try {
    const data = await fs.readFile(filePath);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    const isText = contentType.includes('text') || contentType.includes('json') || contentType.includes('svg');

    return {
      statusCode: 200,
      headers: { 'Content-Type': contentType },
      body: isText ? data.toString('utf8') : data.toString('base64'),
      isBase64Encoded: !isText
    };
  } catch (err) {
    console.error("Error reading file:", err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
