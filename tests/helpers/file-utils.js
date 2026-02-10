/**
 * File utility functions for testing
 */

const fs = require('fs');
const path = require('path');

/**
 * Get the directory structure of a template as a sorted array of relative paths
 * @param {string} templateDir - The template directory path
 * @param {string} baseDir - The base directory for relative paths (defaults to templateDir)
 * @returns {string[]} - Sorted array of relative directory paths
 */
function getDirectoryStructure(templateDir, baseDir = templateDir) {
  const directories = [];
  
  function traverse(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip hidden directories like .git
        if (!entry.name.startsWith('.')) {
          const relativePath = path.relative(baseDir, fullPath);
          directories.push(relativePath);
          traverse(fullPath);
        }
      }
    }
  }
  
  traverse(templateDir);
  return directories.sort();
}

/**
 * Get all files in a directory with their types
 * @param {string} dirPath - The directory path
 * @returns {Object} - Object with file types as keys and arrays of filenames as values
 */
function getFilesByType(dirPath) {
  const filesByType = {
    html: [],
    css: [],
    js: [],
    images: [],
    fonts: [],
    other: []
  };
  
  if (!fs.existsSync(dirPath)) {
    return filesByType;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile() && !entry.name.startsWith('.')) {
      const ext = path.extname(entry.name).toLowerCase();
      
      if (ext === '.html') {
        filesByType.html.push(entry.name);
      } else if (ext === '.css') {
        filesByType.css.push(entry.name);
      } else if (ext === '.js') {
        filesByType.js.push(entry.name);
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        filesByType.images.push(entry.name);
      } else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
        filesByType.fonts.push(entry.name);
      } else {
        filesByType.other.push(entry.name);
      }
    }
  }
  
  return filesByType;
}

/**
 * Check if a directory exists
 * @param {string} dirPath - The directory path
 * @returns {boolean} - True if directory exists
 */
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a file exists
 * @param {string} filePath - The file path
 * @returns {boolean} - True if file exists
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Get the structure comparison between two templates
 * @param {string} template1 - First template directory
 * @param {string} template2 - Second template directory
 * @returns {Object} - Object with missing and extra directories
 */
function compareDirectoryStructures(template1, template2) {
  const struct1 = getDirectoryStructure(template1);
  const struct2 = getDirectoryStructure(template2);
  
  const missing = struct1.filter(dir => !struct2.includes(dir));
  const extra = struct2.filter(dir => !struct1.includes(dir));
  
  return { missing, extra, identical: missing.length === 0 && extra.length === 0 };
}

module.exports = {
  getDirectoryStructure,
  getFilesByType,
  directoryExists,
  fileExists,
  compareDirectoryStructures
};
