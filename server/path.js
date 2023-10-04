import { fileURLToPath } from 'url';
import { dirname as pathDirname, join as pathJoin } from 'path';

export function projectPath(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const currentDir = pathDirname(__filename);
  return pathJoin(currentDir, '../');
}