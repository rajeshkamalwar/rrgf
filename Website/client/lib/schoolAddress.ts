/** Canonical school postal address (site-wide). */
export const SCHOOL_ADDRESS =
  'West bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar';

export const SCHOOL_ADDRESS_MAPS_QUERY =
  'West+bypass,+Sahugadh+Road,+Ward+No.+2,+Madhepura+-+852113,+Bihar';

export const SCHOOL_ADDRESS_MAPS_URL = `https://maps.google.com/?q=${SCHOOL_ADDRESS_MAPS_QUERY}`;

/** Replace legacy “New bypass” MPD rows and empty address cells with the canonical address. */
export function normalizeSchoolAddressValue(value: string): string {
  const t = value.trim();
  if (!t || /new\s+bypass/i.test(t)) {
    return SCHOOL_ADDRESS;
  }
  return t;
}
