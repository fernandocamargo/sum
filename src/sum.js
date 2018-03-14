const fs = require('fs');
const path = require('path');

const accumulate = (previous, next) => Number(previous) + Number(next);

const add = (...numbers) => numbers.filter(Number).reduce(accumulate, 0);

const load = file => fs.existsSync(file) && fs.readFileSync(file, 'utf8');

const parse = file => (stack, line) => {
  const nested = path.join(path.dirname(file), line);
  const deep = fs.existsSync(nested) && sum(nested);

  return Object.assign(stack, deep, {
    [file]: add(stack[file], line, deep[nested]),
  });
};

const sum = source => {
  const file = path.normalize(source);

  return String(load(file))
    .trim()
    .replace('\r', 'gi')
    .split('\n')
    .reduce(parse(file), { [file]: 0 });
};

module.exports = sum;
