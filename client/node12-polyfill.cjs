// Patch per Node.js 12 per supportare import() dinamici e altre funzionalità moderne
const Module = require('module');
const originalRequire = Module.prototype.require;

// Intercetta require('source-map-support') per evitare l'uso di await a livello superiore
Module.prototype.require = function(path) {
  if (path === 'source-map-support') {
    return { default: { install: () => {} } };
  }
  return originalRequire.apply(this, arguments);
};

// Patch per il file vite.js per evitare l'uso di await a livello superiore
const fs = require('fs');
const path = require('path');

try {
  const vitePath = path.resolve('./node_modules/vite/bin/vite.js');
  if (fs.existsSync(vitePath)) {
    let content = fs.readFileSync(vitePath, 'utf8');
    
    // Sostituisci await import con una versione compatibile
    content = content.replace(
      /await import\('source-map-support'\)\.then\(\(r\) => r\.default\.install\(\)\)/g,
      'Promise.resolve().then(() => require("source-map-support").install())'
    );
    
    // Scrivi il file modificato
    fs.writeFileSync(vitePath + '.patched', content);
    
    // Sostituisci il file originale
    fs.renameSync(vitePath + '.patched', vitePath);
    
    console.log('Vite.js patched successfully for Node.js 12 compatibility');
  }
} catch (error) {
  console.error('Failed to patch vite.js:', error);
} 