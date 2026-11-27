'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateInvoice } = require('../src/index');
const { taxFor } = require('../src/tax');

test('DE is accepted at 19%', () => {
  assert.equal(taxFor(10000, 'DE'), 1900);
});

test('invoice of 10000 cents for DE has tax 1900 and total 11900', () => {
  const r = calculateInvoice({ region: 'DE', lines: [{ description: 'Widget', quantity: 1, unitPriceCents: 10000 }] });
  assert.equal(r.subtotalCents, 10000);
  assert.equal(r.taxCents, 1900);
  assert.equal(r.totalCents, 11900);
});

test('regions not in the table are refused, including lowercase de', () => {
  assert.throws(() => taxFor(10000, 'FR'), { message: 'Unknown tax region: FR' });
  assert.throws(() => taxFor(10000, 'de'), { message: 'Unknown tax region: de' });
});

test('IN, UK and US rates are unchanged', () => {
  assert.equal(taxFor(10000, 'IN'), 1800);
  assert.equal(taxFor(10000, 'UK'), 2000);
  assert.equal(taxFor(10000, 'US'), 0);
});

test('ES is accepted at 21%', () => {
  assert.equal(taxFor(10000, 'ES'), 2100);
});

test('invoice of 10000 cents for ES has tax 2100 and total 12100', () => {
  const r = calculateInvoice({ region: 'ES', lines: [{ description: 'Widget', quantity: 1, unitPriceCents: 10000 }] });
  assert.equal(r.subtotalCents, 10000);
  assert.equal(r.taxCents, 2100);
  assert.equal(r.totalCents, 12100);
});

test('lowercase es is refused like any unknown region', () => {
  assert.throws(() => taxFor(10000, 'es'), { message: 'Unknown tax region: es' });
});
