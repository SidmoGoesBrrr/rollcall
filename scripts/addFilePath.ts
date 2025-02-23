import fs from 'fs';
import path from 'path';

/**
 * Recursively traverse a directory and process all .ts and .tsx files.
 * @param dir - The directory to traverse.
 */
function traverseDir(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else if (
      stat.isFile() &&
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))
    ) {
      processFile(fullPath);
    }
  }
}

/**
 * Reads a file, checks if it already starts with the file path comment,
 * and if not, prepends the comment.
 * @param filePath - The full path of the file to process.
 */
function processFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  // Define the file path comment. You can change the format as needed.
  const filePathComment = `// File path: ${filePath}`;

  // Check if the file already starts with the file path comment.
  if (fileContent.startsWith(filePathComment)) {
    return;
  }

  // Prepend the file path comment and write back to the file.
  const newContent = `${filePathComment}\n${fileContent}`;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated: ${filePath}`);
}

// Define the root directory. This example uses the current working directory.
const projectRoot = process.cwd();
traverseDir(projectRoot);
