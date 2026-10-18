#!/usr/bin/env node
'use strict';

// Supports addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (** or ^), and square root (sqrt).
function validateFiniteOperands(...operands) {
  if (!operands.every(Number.isFinite)) {
    throw new TypeError('Operands must be finite numbers.');
  }
}

function modulo(a, b) {
  validateFiniteOperands(a, b);
  if (b === 0) {
    throw new RangeError('Cannot calculate modulo by zero.');
  }
  return a % b;
}

function power(base, exponent) {
  validateFiniteOperands(base, exponent);
  return base ** exponent;
}

function squareRoot(n) {
  validateFiniteOperands(n);
  if (n < 0) {
    throw new RangeError('Cannot calculate the square root of a negative number.');
  }
  return Math.sqrt(n);
}

function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError('Both operands must be finite numbers.');
  }

  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) {
        throw new RangeError('Cannot divide by zero.');
      }
      return left / right;
    case '%':
      return modulo(left, right);
    case '**':
    case '^':
      return power(left, right);
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

function main(args) {
  if (args.length === 2 && args[0] === 'sqrt') {
    const value = Number(args[1]);
    try {
      console.log(squareRoot(value));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    }
    return;
  }

  if (args.length !== 3) {
    console.error(
      'Usage: node src/calculator.js <number> <operator> <number>\n' +
        '       node src/calculator.js sqrt <number>\n' +
        'Operators: +, -, *, /, %, **, ^',
    );
    process.exitCode = 1;
    return;
  }

  const [leftInput, operator, rightInput] = args;
  const left = Number(leftInput);
  const right = Number(rightInput);

  try {
    console.log(calculate(left, operator, right));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate, modulo, power, squareRoot };
