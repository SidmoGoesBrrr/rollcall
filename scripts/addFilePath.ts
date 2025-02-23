// File path: scripts/addFilePath.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively traverse a directory and process all .ts and .tsx files.
 * @param dir - The directory to traverse.
 * @param projectRoot - The root directory to compute relative paths.
 */
function traverseDir(dir: string, projectRoot: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDir(fullPath, projectRoot);
    } else if (
      stat.isFile() &&
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))
    ) {
      processFile(fullPath, projectRoot);
    }
  }
}

/**
 * Reads a file, checks if it already starts with a file path comment,
 * and either replaces that comment or prepends a new one with the file path relative to the project root.
 * @param filePath - The full path of the file to process.
 * @param projectRoot - The root directory to compute the relative path.
 */
function processFile(filePath: string, projectRoot: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(projectRoot, filePath);
  const newComment = `// File path: ${relativePath}`;

  // Split file content into lines
  const lines = fileContent.split('\n');

  // Check if the first line is a file path comment (e.g., starts with '// File path:')
  if (lines[0].startsWith('// File path:')) {
    // Replace the first line with the new comment
    lines[0] = newComment;
  } else {
    // Otherwise, add the new comment as the first line
    lines.unshift(newComment);
  }

  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated: ${relativePath}`);
}

// Define the root directory. Typically, this is your project root.
const projectRoot = process.cwd();
traverseDir(projectRoot, projectRoot);
