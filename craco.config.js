const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Redirect all 'three' imports to our patched version
      'three': path.resolve(__dirname, './src/patches/three-compatibility.js')
    }
  }
};