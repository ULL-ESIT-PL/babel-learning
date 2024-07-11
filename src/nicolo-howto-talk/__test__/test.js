const pluginTester = require('babel-plugin-tester');
const plugin = require('../optionalchaining-plugin2.cjs');
const path = require('path');

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
}); 