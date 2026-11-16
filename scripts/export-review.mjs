import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

const source = fs.readFileSync('src/routes/kb/incidents/4471-review/+page.svx','utf8');
const signature = source.match(/^signature: '(.*)'$/m)?.[1];
assert.ok(signature, 'The review must be signed');
let html = fs.readFileSync('build/kb/incidents/4471-review/index.html','utf8');
assert.ok(html.includes(deskRef(signature)), 'Actual RenderStamp output must match the source signature');
assert.ok(!html.includes('no desk ref:'), 'Signature must reach RenderStamp');
// Keep a self-contained reading copy of the actual prerendered HTML, including the
// original component CSS. The full build retains its interactive Svelte app.
html = html.replace(/<link\b[^>]*>/g, tag => {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (tag.includes('rel="stylesheet"') && href) {
    const css = fs.readFileSync(path.resolve('build/kb/incidents/4471-review',href),'utf8');
    return `<style>${css}</style>`;
  }
  return '';
}).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
html = html.replace('</head>', '<style>table{overflow-wrap:anywhere}td{vertical-align:top}@media(max-width:600px){.kb{overflow-x:auto}table{font-size:.8rem!important}}</style></head>');
fs.writeFileSync('evidence/4471-review.html', html);
console.log('Verified signed render and wrote evidence/4471-review.html');
