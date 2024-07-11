const path = require('path');
module.exports = {
  plugins: [
    [ path.join(__dirname, 'optionalchaining-plugin2.cjs'), { loose: true} ],
  ]
}