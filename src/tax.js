'use strict';
const { roundCents } = require('./money');

// Tax rates by customer region, in percent. See docs/domain/pricing-rules.md.
const RATES = { IN: 18, UK: 20, US: 0, DE: 19 };

/** Tax in cents on a net amount for a region. Unknown regions are an error, never zero. */
function taxFor(netCents, region) {
  if (!Object.prototype.hasOwnProperty.call(RATES, region)) {
    throw new Error(`Unknown tax region: ${region}`);
  }
  return roundCents((netCents * RATES[region]) / 100);
}

module.exports = { taxFor, RATES };
