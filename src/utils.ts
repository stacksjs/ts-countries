import type { Country } from './Country'
import type { CountryAttributes, CountryList } from './types'
import { CountryLoader } from './CountryLoader'
import { CurrencyLoader } from './CurrencyLoader'

/**
 * Get the country by its ISO 3166-1 alpha-2
 *
 * @param code The country code
 * @param hydrate Whether to hydrate the country data into a Country instance
 * @returns The country data or instance
 */
export function country(code: string, hydrate = true): Country | CountryAttributes {
  return CountryLoader.country(code, hydrate)
}

/**
 * Get all countries short-listed
 *
 * @param longlist Whether to get the long list
 * @param hydrate Whether to hydrate the country data into Country instances
 * @returns The countries
 */
export function countries(longlist = false, hydrate = false): Country[] | CountryList {
  return CountryLoader.countries(longlist, hydrate)
}

/**
 * Get all currencies
 *
 * @param longlist Whether to get detailed currency information
 * @returns The currencies
 */
export function currencies(longlist = false): Record<string, any> {
  return CurrencyLoader.currencies(longlist)
}
