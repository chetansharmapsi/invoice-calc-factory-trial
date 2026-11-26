'use strict';
const { roundCents } = require('./money');

// Bulk discount, fixed by the business. See docs/domain/pricing-rules.md.
const BULK_THRESHOLD_CENTS = 100000;
const BULK_RATE_PERCENT = 10;

/** Bulk discount in cents for a subtotal. Zero below the threshold. */
function bulkDiscountFor(subtotalCents) {
  if (subtotalCents < BULK_THRESHOLD_CENTS) return 0;
  return roundCents((subtotalCents * BULK_RATE_PERCENT) / 100);
}

module.exports = { bulkDiscountFor, BULK_THRESHOLD_CENTS, BULK_RATE_PERCENT };
