const test = require('tape');
const path = require('path');
const fs = require('fs');
const sum = require('../src/sum');

// Helper to create temporary test files
const createTestFile = (filename, content) => {
  const filepath = path.join(__dirname, 'fixtures', filename);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
  return filepath;
};

// Helper to cleanup test files
const cleanup = () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  if (fs.existsSync(fixturesDir)) {
    fs.rmSync(fixturesDir, { recursive: true, force: true });
  }
};

test('setup', t => {
  cleanup();
  t.end();
});

test('sum of single file with only numbers', t => {
  t.plan(1);
  const file = createTestFile('numbers.txt', '10\n20\n30');
  const result = sum(file);
  t.equal(result[file], 60, 'should sum all numbers correctly');
});

test('sum of file with nested reference', t => {
  t.plan(2);
  const fileB = createTestFile('nested-b.txt', '5\n10');
  const fileA = createTestFile('nested-a.txt', `15\nnested-b.txt\n20`);
  const result = sum(fileA);

  t.equal(result[fileA], 50, 'parent file should include nested sum');
  t.equal(result[fileB], 15, 'nested file sum should be calculated');
});

test('sum with deep nesting (3 levels)', t => {
  t.plan(3);
  const fileC = createTestFile('deep-c.txt', '1\n2');
  const fileB = createTestFile('deep-b.txt', `deep-c.txt\n10`);
  const fileA = createTestFile('deep-a.txt', `deep-b.txt\n100`);
  const result = sum(fileA);

  t.equal(result[fileC], 3, 'deepest file sum');
  t.equal(result[fileB], 13, 'middle file sum');
  t.equal(result[fileA], 113, 'top file sum includes all nested');
});

test('sum with multiple nested files', t => {
  t.plan(4);
  const fileC = createTestFile('multi-c.txt', '5');
  const fileD = createTestFile('multi-d.txt', '10');
  const fileB = createTestFile('multi-b.txt', `multi-c.txt\nmulti-d.txt\n20`);
  const fileA = createTestFile('multi-a.txt', `multi-b.txt\n100`);
  const result = sum(fileA);

  t.equal(result[fileC], 5, 'first nested file');
  t.equal(result[fileD], 10, 'second nested file');
  t.equal(result[fileB], 35, 'parent includes both nested files');
  t.equal(result[fileA], 135, 'top includes all');
});

test('sum with empty lines', t => {
  t.plan(1);
  const file = createTestFile('empty-lines.txt', '10\n\n20\n\n\n30');
  const result = sum(file);
  t.equal(result[file], 60, 'should ignore empty lines');
});

test('sum with zero values', t => {
  t.plan(1);
  const file = createTestFile('zeros.txt', '0\n10\n0\n20');
  const result = sum(file);
  t.equal(result[file], 30, 'should handle zeros correctly');
});

test('sum with decimal numbers', t => {
  t.plan(1);
  const file = createTestFile('decimals.txt', '10.5\n20.25\n5.75');
  const result = sum(file);
  t.equal(result[file], 36.5, 'should handle decimal numbers');
});

test('sum with negative numbers', t => {
  t.plan(1);
  const file = createTestFile('negatives.txt', '10\n-5\n20\n-3');
  const result = sum(file);
  t.equal(result[file], 22, 'should handle negative numbers');
});

test('sum of file with only whitespace', t => {
  t.plan(1);
  const file = createTestFile('whitespace.txt', '  \n\n  \n');
  const result = sum(file);
  t.equal(result[file], 0, 'should return 0 for whitespace-only file');
});

test('sum with Windows line endings (CRLF)', t => {
  t.plan(1);
  const file = createTestFile('crlf.txt', '10\r\n20\r\n30');
  const result = sum(file);
  t.equal(result[file], 60, 'should handle Windows line endings');
});

test('sum with non-existent nested file reference', t => {
  t.plan(1);
  const file = createTestFile('missing-ref.txt', '10\nnonexistent.txt\n20');
  const result = sum(file);
  t.equal(result[file], 30, 'should skip non-existent file references');
});

test('verify actual data files - A.txt', t => {
  t.plan(1);
  const filepath = path.join(__dirname, '../data/A.txt');
  const result = sum(filepath);
  const normalizedPath = path.normalize(filepath);
  t.equal(result[normalizedPath], 132, 'A.txt should sum to 132');
});

test('verify actual data files - B.txt', t => {
  t.plan(1);
  const filepath = path.join(__dirname, '../data/B.txt');
  const result = sum(filepath);
  const normalizedPath = path.normalize(filepath);
  t.equal(result[normalizedPath], 60, 'B.txt should sum to 60');
});

test('verify actual data files - C.txt', t => {
  t.plan(1);
  const filepath = path.join(__dirname, '../data/C.txt');
  const result = sum(filepath);
  const normalizedPath = path.normalize(filepath);
  t.equal(result[normalizedPath], 12, 'C.txt should sum to 12');
});

test('verify actual data files - D.txt', t => {
  t.plan(1);
  const filepath = path.join(__dirname, '../data/D.txt');
  const result = sum(filepath);
  const normalizedPath = path.normalize(filepath);
  t.equal(result[normalizedPath], 21, 'D.txt should sum to 21');
});

test('cleanup', t => {
  cleanup();
  t.end();
});
