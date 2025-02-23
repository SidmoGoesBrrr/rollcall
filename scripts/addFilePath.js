"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
/**
 * Recursively traverse a directory and process all .ts and .tsx files.
 * @param dir - The directory to traverse.
 * @param projectRoot - The root directory to compute relative paths.
 */
function traverseDir(dir, projectRoot) {
    var files = fs.readdirSync(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var fullPath = path.join(dir, file);
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath, projectRoot);
        }
        else if (stat.isFile() &&
            (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
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
function processFile(filePath, projectRoot) {
    var fileContent = fs.readFileSync(filePath, 'utf8');
    var relativePath = path.relative(projectRoot, filePath);
    var newComment = "// File path: ".concat(relativePath);
    // Split file content into lines
    var lines = fileContent.split('\n');
    // Check if the first line is a file path comment (e.g., starts with '// File path:')
    if (lines[0].startsWith('// File path:')) {
        // Replace the first line with the new comment
        lines[0] = newComment;
    }
    else {
        // Otherwise, add the new comment as the first line
        lines.unshift(newComment);
    }
    var newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Updated: ".concat(relativePath));
}
// Define the root directory. Typically, this is your project root.
var projectRoot = process.cwd();
traverseDir(projectRoot, projectRoot);
