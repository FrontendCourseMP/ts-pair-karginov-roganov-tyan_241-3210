import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateExpression } from "../dist/calculator/calculator.js";

test("приоритет * над +: 12+3*4 → 24", () => {
  assert.equal(evaluateExpression("12+3*4"), 24);
});

test("несколько сложений: 1+2+3 → 6", () => {
  assert.equal(evaluateExpression("1+2+3"), 6);
});

test("несколько умножений: 2*3*4 → 24", () => {
  assert.equal(evaluateExpression("2*3*4"), 24);
});

test("смешанно по приоритету: 1*2+3 → 5", () => {
  assert.equal(evaluateExpression("1*2+3"), 5);
});

test("дроби и пробелы: 2.5 * 4 → 10", () => {
  assert.equal(evaluateExpression(" 2.5 * 4 "), 10);
});
