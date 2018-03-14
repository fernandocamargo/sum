const fs = require('fs');
const path = require('path');

const isNumber = object => !isNaN(Number(object));

const accumulate = (previous, next) => Number(previous) + Number(next);

const add = (...numbers) => numbers.filter(Number).reduce(accumulate, 0);

const read = file => fs.readFileSync(file, 'utf8');

const exist = file => fs.existsSync(file);

const load = file => exist(file) && read(file);

const dig = file => sum(file);

const parse = file => (stack, line) => {
  const nested = path.join(path.dirname(file), line);
  const deep = exist(nested) && dig(nested);

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
