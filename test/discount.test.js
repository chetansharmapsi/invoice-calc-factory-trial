'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { bulkDiscountFor } = require('../src/discount');

test('no discount below the threshold', () => assert.equal(bulkDiscountFor(99999), 0));
test('10% at exactly the threshold', () => assert.equal(bulkDiscountFor(100000), 10000));
test('rounds half up', () => assert.equal(bulkDiscountFor(100005), 10001));
