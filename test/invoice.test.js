'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateInvoice, formatCents } = require('../src/index');

const line = (description, quantity, unitPriceCents) => ({ description, quantity, unitPriceCents });

test('one line, no tax region', () => {
  const r = calculateInvoice({ region: 'US', lines: [line('Widget', 2, 1250)] });
  assert.equal(r.subtotalCents, 2500);
  assert.equal(r.taxCents, 0);
  assert.equal(r.totalCents, 2500);
  assert.deepEqual(r.lines, [{ description: 'Widget', totalCents: 2500 }]);
});

test('tax is added for a taxed region and rounded half up', () => {
  const r = calculateInvoice({ region: 'IN', lines: [line('Pen', 3, 333)] });
  assert.equal(r.subtotalCents, 999);
  assert.equal(r.taxCents, 180); // 179.82 rounds to 180
  assert.equal(r.totalCents, 1179);
});

test('several lines are summed before tax', () => {
  const r = calculateInvoice({ region: 'UK', lines: [line('A', 1, 1000), line('B', 4, 250)] });
  assert.equal(r.subtotalCents, 2000);
  assert.equal(r.taxCents, 400);
  assert.equal(r.totalCents, 2400);
});

test('an unknown region is an error, not zero tax', () => {
  assert.throws(() => calculateInvoice({ region: 'FR', lines: [line('A', 1, 100)] }), /Unknown tax region: FR/);
});

test('invalid lines are rejected', () => {
  assert.throws(() => calculateInvoice({ region: 'US', lines: [] }), /at least one line/);
  assert.throws(() => calculateInvoice({ region: 'US', lines: [line('A', 0, 100)] }), /Quantity/);
  assert.throws(() => calculateInvoice({ region: 'US', lines: [line('A', 1, 9.5)] }), /Unit price/);
  assert.throws(() => calculateInvoice({ region: 'US', lines: [line(' ', 1, 100)] }), /description/);
});

test('formatCents', () => {
  assert.equal(formatCents(1250), '12.50');
  assert.equal(formatCents(5), '0.05');
  assert.equal(formatCents(-199), '-1.99');
});

test('DE is taxed at 19%', () => {
  const r = calculateInvoice({ region: 'DE', lines: [line('A', 1, 10000)] });
  assert.equal(r.subtotalCents, 10000);
  assert.equal(r.taxCents, 1900);
  assert.equal(r.totalCents, 11900);
});

test('DE tax is rounded half up', () => {
  const r = calculateInvoice({ region: 'DE', lines: [line('A', 1, 50)] });
  assert.equal(r.taxCents, 10); // 9.5 rounds to 10
  assert.equal(r.totalCents, 60);
});

test('lowercase de is still refused', () => {
  assert.throws(() => calculateInvoice({ region: 'de', lines: [line('A', 1, 100)] }), /Unknown tax region: de/);
});
