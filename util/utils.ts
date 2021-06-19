import { fileURLToPath } from 'url';
import path from 'path';

export const basename = (name: string): string => {
  const extension = path.extname(name);
  return extension ? name : name.slice(0, -extension.length);
};

export const isMain = (meta: unknown): boolean => {
  // looks like `import.meta` has no a valid type for now.
  const modulePath = fileURLToPath((meta as { url: string })?.url ?? '');

  const scriptPath = process.argv[1];
  if (!scriptPath)
    return false;
  const extension = path.extname(scriptPath);

  return extension ? modulePath === scriptPath : basename(modulePath) === scriptPath;
};
