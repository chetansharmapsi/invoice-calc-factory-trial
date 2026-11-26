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

test('bulk discount: AC-1 subtotal 100000, US', () => {
  const r = calculateInvoice({ region: 'US', lines: [line('Bulk', 1, 100000)] });
  assert.equal(r.subtotalCents, 100000);
  assert.equal(r.discountCents, 10000);
  assert.equal(r.taxCents, 0);
  assert.equal(r.totalCents, 90000);
});

test('bulk discount: AC-2 subtotal 150000, UK taxed after discount', () => {
  const r = calculateInvoice({ region: 'UK', lines: [line('Bulk', 1, 150000)] });
  assert.equal(r.discountCents, 15000);
  assert.equal(r.taxCents, 27000);
  assert.equal(r.totalCents, 162000);
});

test('bulk discount: AC-4 subtotal 99999, IN unchanged', () => {
  const r = calculateInvoice({ region: 'IN', lines: [line('Almost', 1, 99999)] });
  assert.equal(r.discountCents, 0);
  assert.equal(r.taxCents, 18000);
  assert.equal(r.totalCents, 117999);
});

test('bulk discount: AC-5 discountCents present and 0 without discount', () => {
  const r = calculateInvoice({ region: 'US', lines: [line('Widget', 2, 1250)] });
  assert.equal(r.discountCents, 0);
});

test('bulk discount: unknown region still throws on a qualifying invoice', () => {
  assert.throws(() => calculateInvoice({ region: 'XX', lines: [line('Bulk', 1, 200000)] }), /Unknown tax region/);
});
