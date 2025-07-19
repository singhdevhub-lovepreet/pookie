const path = require('path');

module.exports = function(app) {
  // This file is used by react-scripts to configure webpack
  // We'll use it to add an alias for 'three' to use our patched version
  
  // Get the webpack config
  const webpackConfigPath = path.resolve(__dirname, '../node_modules/react-scripts/config/webpack.config.js');
  const webpackConfig = require(webpackConfigPath);
  
  // Add our alias to the webpack resolve config
  const originalFactory = webpackConfig;
  
  // Override the webpack config factory
  module.exports = function(webpackEnv) {
    const config = originalFactory(webpackEnv);
    
    // Add alias for 'three'
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': path.resolve(__dirname, './patches/three-compatibility.js')
    };
    
    return config;
  };
};