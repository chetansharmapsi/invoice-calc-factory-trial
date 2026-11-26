'use strict';
const { lineTotal } = require('./lines');
const { bulkDiscountFor } = require('./discount');
const { taxFor } = require('./tax');
const { formatCents } = require('./money');

/**
 * Calculate an invoice.
 * @param {{region: string, lines: {description: string, quantity: number, unitPriceCents: number}[]}} invoice
 * @returns {{subtotalCents: number, discountCents: number, taxCents: number, totalCents: number, lines: {description: string, totalCents: number}[]}}
 */
function calculateInvoice(invoice) {
  if (!invoice || !Array.isArray(invoice.lines) || invoice.lines.length === 0) {
    throw new Error('An invoice needs at least one line');
  }
  const lines = invoice.lines.map((line) => ({ description: line.description, totalCents: lineTotal(line) }));
  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);
  const discountCents = bulkDiscountFor(subtotalCents);
  const netCents = subtotalCents - discountCents;
  const taxCents = taxFor(netCents, invoice.region);
  return { subtotalCents, discountCents, taxCents, totalCents: netCents + taxCents, lines };
}

module.exports = { calculateInvoice, formatCents };
