'use strict';
const { roundCents } = require('./money');

/**
 * Validate one invoice line and return its total in cents.
 * @param {{description: string, quantity: number, unitPriceCents: number}} line
 */
function lineTotal(line) {
  if (!line || typeof line.description !== 'string' || !line.description.trim()) {
    throw new Error('A line needs a description');
  }
  if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
    throw new Error(`Quantity must be a positive whole number: ${line.description}`);
  }
  if (!Number.isInteger(line.unitPriceCents) || line.unitPriceCents < 0) {
    throw new Error(`Unit price must be a whole number of cents, zero or more: ${line.description}`);
  }
  return roundCents(line.quantity * line.unitPriceCents);
}

module.exports = { lineTotal };
