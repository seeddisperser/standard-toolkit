/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the token generator using dynamic import with tsx
import { readFileSync } from 'node:fs';

async function generateTokens() {
  try {
    console.log('🔄 Generating design tokens...');

    // Read the tokens.json file
    const tokensPath = path.join(
      __dirname,
      '..',
      'src',
      'tokens',
      'tokens.json',
    );
    const tokensContent = readFileSync(tokensPath, 'utf-8');
    const tokens = JSON.parse(tokensContent);

    // Generate files in the src/tokens directory
    const outputDir = path.join(__dirname, '..', 'src', 'tokens', 'generated');

    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Generate CSS variables
    const cssContent = generateCSS(tokens);
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.css'),
      cssContent,
      'utf-8',
    );

    // Generate TypeScript constants and types
    const tsContent = generateTypeScript(tokens);
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.ts'),
      tsContent,
      'utf-8',
    );

    console.log('✅ Design tokens generated successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('📄 Generated files:');
    console.log('   - tokens.css (CSS variables)');
    console.log('   - tokens.ts (TypeScript constants and types)');
  } catch (error) {
    console.error('❌ Error generating design tokens:', error);
    process.exit(1);
  }
}

function flattenTokens(obj, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTokens(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

function toCamelCase(str) {
  // Remove all non-alphanumeric characters and convert to camelCase
  return str
    .replace(/[-_]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(\d)/, '_$1'); // prefix leading digit with underscore
}

function generateCSS(tokens) {
  const flattened = flattenTokens(tokens);
  const cssLines = [];

  // Start :root block
  cssLines.push(':root {');

  // Generate CSS variables
  for (const [key, value] of Object.entries(flattened)) {
    cssLines.push(`  --${key}: ${value};`);
  }

  // Close :root block
  cssLines.push('}');

  return cssLines.join('\n');
}

function extractVarReference(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const varMatch = value.match(/^var\(--([a-zA-Z0-9-_]+)\)$/);
  return varMatch ? varMatch[1] : null;
}

function resolveReferences(flattened) {
  // Recursively resolve var(--...) references to their concrete values
  const resolved = {};
  const resolving = {};
  function resolveValue(key) {
    if (resolved[key] !== undefined) {
      return resolved[key];
    }
    if (resolving[key]) {
      throw new Error(`Circular reference detected for token: ${key}`);
    }
    resolving[key] = true;
    const value = flattened[key];
    const refKey = extractVarReference(value);
    if (refKey) {
      if (refKey in flattened) {
        resolved[key] = resolveValue(refKey);
      } else {
        resolved[key] = value; // fallback to original if not found
      }
    } else {
      resolved[key] = value;
    }
    resolving[key] = false;
    return resolved[key];
  }
  for (const key of Object.keys(flattened)) {
    resolveValue(key);
  }
  return resolved;
}

function generateTypeScript(tokens) {
  const flattened = flattenTokens(tokens);
  const resolved = resolveReferences(flattened);
  const tsLines = [];

  // Generate TypeScript types
  const tokenKeys = Object.keys(resolved).map((key) => toCamelCase(key));
  tsLines.push('export type DesignToken =');
  tsLines.push(`  | ${tokenKeys.map((key) => `'${key}'`).join('\n  | ')};`);
  tsLines.push('');

  // Generate TypeScript constants (no type annotation)
  for (const [key, value] of Object.entries(resolved)) {
    const camelCaseKey = toCamelCase(key);
    tsLines.push(`export const ${camelCaseKey} = '${value}';`);
  }

  return tsLines.join('\n');
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTokens();
}

export { generateTokens };
