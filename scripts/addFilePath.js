"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
/**
 * Recursively traverse a directory and process all .ts and .tsx files.
 * @param dir - The directory to traverse.
 */
function traverseDir(dir) {
    var files = fs_1.default.readdirSync(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var fullPath = path_1.default.join(dir, file);
        var stat = fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        }
        else if (stat.isFile() &&
            (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
            processFile(fullPath);
        }
    }
}
/**
 * Reads a file, checks if it already starts with the file path comment,
 * and if not, prepends the comment.
 * @param filePath - The full path of the file to process.
 */
function processFile(filePath) {
    var fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    // Define the file path comment. You can change the format as needed.
    var filePathComment = "// File path: ".concat(filePath);
    // Check if the file already starts with the file path comment.
    if (fileContent.startsWith(filePathComment)) {
        return;
    }
    // Prepend the file path comment and write back to the file.
    var newContent = "".concat(filePathComment, "\n").concat(fileContent);
    fs_1.default.writeFileSync(filePath, newContent, 'utf8');
    console.log("Updated: ".concat(filePath));
}
// Define the root directory. This example uses the current working directory.
var projectRoot = process.cwd();
traverseDir(projectRoot);
