import type { CountryList } from './types'
import { CountryLoader } from './CountryLoader'

/**
 * CurrencyLoader class for loading currency data
 */
export class CurrencyLoader {
  /**
   * The currencies cache
   */
  private static currencyCache: Record<string, Record<string, any>> = {}

  /**
   * Retrieve all the currencies of all countries
   *
   * @param longlist Whether to get detailed currency information
   * @returns The currencies
   */
  public static currencies(longlist = false): Record<string, any> {
    const list = longlist ? 'longlist' : 'shortlist'

    if (!this.currencyCache[list]) {
      const countries = CountryLoader.countries(longlist) as CountryList
      this.currencyCache[list] = {}

      for (const [_, country] of Object.entries(countries)) {
        if (longlist) {
          if (country.currency) {
            for (const [currency, details] of Object.entries(country.currency)) {
              if (currency) {
                this.currencyCache[list][currency] = longlist ? details : currency
              }
            }
          }
        }
        else {
          if (country.currency) {
            const firstCurrency = Object.keys(country.currency)[0]
            if (firstCurrency) {
              this.currencyCache[list][firstCurrency] = firstCurrency
            }
          }
        }
      }
    }

    const currencies = { ...this.currencyCache[list] }

    // Sort currencies by key
    return Object.keys(currencies)
      .sort()
      .reduce((acc: Record<string, any>, key) => {
        acc[key] = currencies[key]
        return acc
      }, {})
  }
}
