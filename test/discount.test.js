'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { bulkDiscountFor } = require('../src/discount');
const { calculateInvoice } = require('../src/index');

const inv = (region, cents) => ({ region, lines: [{ description: 'x', quantity: 1, unitPriceCents: cents }] });

test('bulkDiscountFor: below, at, above threshold', () => {
  assert.strictEqual(bulkDiscountFor(99999), 0);
  assert.strictEqual(bulkDiscountFor(100000), 10000);
  assert.strictEqual(bulkDiscountFor(150000), 15000);
});

test('bulkDiscountFor: rounds half up', () => {
  assert.strictEqual(bulkDiscountFor(100005), 10001);
});

test('AC-1', () => {
  const r = calculateInvoice(inv('US', 100000));
  assert.deepStrictEqual([r.subtotalCents, r.discountCents, r.taxCents, r.totalCents], [100000, 10000, 0, 90000]);
});

test('AC-2', () => {
  const r = calculateInvoice(inv('UK', 150000));
  assert.deepStrictEqual([r.discountCents, r.taxCents, r.totalCents], [15000, 27000, 162000]);
});

test('AC-3', () => {
  assert.strictEqual(calculateInvoice(inv('US', 100005)).discountCents, 10001);
});

test('AC-4 / AC-5: below threshold, discountCents is 0', () => {
  const r = calculateInvoice(inv('IN', 99999));
  assert.deepStrictEqual([r.discountCents, r.taxCents, r.totalCents], [0, 18000, 117999]);
});

test('unknown region still throws on a discounted invoice', () => {
  assert.throws(() => calculateInvoice(inv('XX', 200000)), /Unknown tax region/);
});
