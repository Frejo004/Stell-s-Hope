import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const fixReactImports = (filePath) => {
  const content = readFileSync(filePath, 'utf8');
  
  // Fix: import React, { ... } from 'react'; -> import { ... } from 'react';
  let fixed = content.replace(/^import React,\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"]/m, 'import { $1 } from \'react\'');
  
  // Fix: import React from 'react'; -> remove entirely if not used
  fixed = fixed.replace(/^import React from ['"]react['"]/m, '');
  
  if (fixed !== content) {
    writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
};

const processDirectory = (dir) => {
  const items = readdirSync(dir);
  let count = 0;
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !fullPath.includes('node_modules')) {
      count += processDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (fixReactImports(fullPath)) {
        count++;
      }
    }
  }
  
  return count;
};

const srcPath = './src';
const count = processDirectory(srcPath);
console.log(`\nTotal files fixed: ${count}`);
