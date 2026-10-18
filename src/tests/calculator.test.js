'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { calculate, modulo, power, squareRoot } = require('../calculator.js');

test('calculates the example operations', async (t) => {
  const examples = [
    { left: 2, operator: '+', right: 3, expected: 5 },
    { left: 10, operator: '-', right: 4, expected: 6 },
    { left: 45, operator: '*', right: 2, expected: 90 },
    { left: 20, operator: '/', right: 5, expected: 4 },
  ];

  for (const { left, operator, right, expected } of examples) {
    await t.test(`${left} ${operator} ${right} = ${expected}`, () => {
      assert.equal(calculate(left, operator, right), expected);
    });
  }
});

test('supports zero, negative, and fractional operands', async (t) => {
  const cases = [
    { left: 0, operator: '+', right: 0, expected: 0 },
    { left: -5, operator: '+', right: 2, expected: -3 },
    { left: 5, operator: '-', right: 8, expected: -3 },
    { left: -3, operator: '*', right: 4, expected: -12 },
    { left: -12, operator: '/', right: 4, expected: -3 },
    { left: 0.1, operator: '+', right: 0.2, expected: 0.1 + 0.2 },
    { left: 1, operator: '/', right: 4, expected: 0.25 },
  ];

  for (const { left, operator, right, expected } of cases) {
    await t.test(`${left} ${operator} ${right}`, () => {
      assert.equal(calculate(left, operator, right), expected);
    });
  }
});

test('rejects division by positive or negative zero', () => {
  assert.throws(() => calculate(1, '/', 0), {
    name: 'RangeError',
    message: 'Cannot divide by zero.',
  });
  assert.throws(() => calculate(1, '/', -0), {
    name: 'RangeError',
    message: 'Cannot divide by zero.',
  });
});

test('rejects non-finite operands', () => {
  for (const operand of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculate(operand, '+', 1), {
      name: 'TypeError',
      message: 'Both operands must be finite numbers.',
    });
    assert.throws(() => calculate(1, '+', operand), {
      name: 'TypeError',
      message: 'Both operands must be finite numbers.',
    });
  }
});

test('rejects unsupported operators', () => {
  assert.throws(() => calculate(1, '&', 2), {
    name: 'Error',
    message: 'Unsupported operator: &',
  });
  assert.throws(() => calculate(1, '$', 2), {
    name: 'Error',
    message: 'Unsupported operator: $',
  });
});

test('calculates modulo', () => {
  assert.equal(modulo(5, 2), 1);
  assert.equal(calculate(5, '%', 2), 1);
  assert.equal(modulo(10, 3), 1);
  assert.equal(calculate(10, '%', 3), 1);
  assert.equal(modulo(-10, 3), -1);
});

test('rejects modulo by zero and non-finite operands', () => {
  assert.throws(() => modulo(10, 0), {
    name: 'RangeError',
    message: 'Cannot calculate modulo by zero.',
  });
  assert.throws(() => calculate(10, '%', 0), /Cannot calculate modulo by zero/);
  assert.throws(() => modulo(Infinity, 3), {
    name: 'TypeError',
    message: 'Operands must be finite numbers.',
  });
});

test('calculates powers using the function and CLI operators', () => {
  assert.equal(power(2, 3), 8);
  assert.equal(calculate(2, '**', 3), 8);
  assert.equal(calculate(2, '^', 3), 8);
  assert.equal(power(9, 0.5), 3);
});

test('rejects non-finite power operands', () => {
  assert.throws(() => power(2, Infinity), {
    name: 'TypeError',
    message: 'Operands must be finite numbers.',
  });
});

test('calculates square roots of non-negative numbers', () => {
  assert.equal(squareRoot(16), 4);
  assert.equal(squareRoot(9), 3);
  assert.equal(squareRoot(0), 0);
  assert.ok(Math.abs(squareRoot(2) ** 2 - 2) < 1e-14);
});

test('rejects negative and non-finite square root inputs', () => {
  assert.throws(() => squareRoot(-1), {
    name: 'RangeError',
    message: 'Cannot calculate the square root of a negative number.',
  });
  assert.throws(() => squareRoot(NaN), {
    name: 'TypeError',
    message: 'Operands must be finite numbers.',
  });
});
