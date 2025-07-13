/**
 * Maps a country code to its full English name using Intl.DisplayNames.
 * @param code - The 2-letter country code.
 * @returns The full English name of the country.
 */
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
export function getCountryName(code: string): string {
  return displayNames.of(code) || 'Unknown';
}
