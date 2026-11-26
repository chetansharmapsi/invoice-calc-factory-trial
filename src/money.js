'use strict';
// All amounts are integers in minor units (cents). Never use floating point for money.

/** Round half up to a whole number of cents. */
function roundCents(value) {
  return Math.floor(value + 0.5);
}

/** Format cents as a string such as "12.50". */
function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

module.exports = { roundCents, formatCents };
