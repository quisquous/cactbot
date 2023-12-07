import { register } from 'node:module';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
register('ts-node/esm', url.pathToFileURL(__filename));
