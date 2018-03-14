const sum = require('./src/sum');

module.exports = console.log(JSON.stringify(sum('./data/A.txt'), null, 2));
