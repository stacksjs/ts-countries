import type { CountryAttributes, CountryList } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import { Country } from './Country'
import { CountryLoaderException } from './CountryLoaderException'

/**
 * CountryLoader class for loading country data
 */
export class CountryLoader {
  /**
   * The countries cache
   */
  private static countryCache: Record<string, CountryAttributes | CountryList> = {}

  /**
   * Get the base directory for data files
   */
  private static getDataDir(): string {
    return path.join(process.cwd(), 'src', 'resources', 'data')
  }

  /**
   * Get the country by its ISO 3166-1 alpha-2
   *
   * @param code The country code
   * @param hydrate Whether to hydrate the country data into a Country instance
   * @returns The country data or instance
   * @throws CountryLoaderException if the country code is invalid
   */
  public static country(code: string, hydrate = true): Country | CountryAttributes {
    code = code.toLowerCase()

    if (!this.countryCache[code]) {
      const filePath = path.join(this.getDataDir(), `${code}.json`)
      this.countryCache[code] = JSON.parse(this.getFile(filePath))
    }

    return hydrate ? new Country(this.countryCache[code] as CountryAttributes) : this.countryCache[code] as CountryAttributes
  }

  /**
   * Get all countries short-listed
   *
   * @param longlist Whether to get the long list
   * @param hydrate Whether to hydrate the country data into Country instances
   * @returns The countries
   * @throws CountryLoaderException if the country data cannot be loaded
   */
  public static countries(longlist = false, hydrate = false): Country[] | CountryList {
    const list = longlist ? 'longlist' : 'shortlist'

    if (!this.countryCache[list]) {
      const filePath = path.join(this.getDataDir(), `${list}.json`)
      this.countryCache[list] = JSON.parse(this.getFile(filePath))
    }

    if (hydrate) {
      return Object.values(this.countryCache[list] as CountryList).map(country => new Country(country))
    }

    return this.countryCache[list] as CountryList
  }

  /**
   * Filter items by the given key value pair
   *
   * @param key The key to filter by
   * @param operator The operator to use
   * @param value The value to filter by
   * @returns The filtered countries
   * @throws CountryLoaderException if the country data cannot be loaded
   */
  public static where(key: string, operator: string, value?: any): CountryList {
    // Handle 2-argument version (key, value)
    if (arguments.length === 2) {
      value = operator
      operator = '='
    }

    if (!this.countryCache.longlist) {
      const filePath = path.join(this.getDataDir(), 'longlist.json')
      this.countryCache.longlist = JSON.parse(this.getFile(filePath))
    }

    return this.filter(this.countryCache.longlist as CountryList, this.operatorForWhere(key, operator, value))
  }

  /**
   * Get an operator checker callback
   *
   * @param key The key to check
   * @param operator The operator to use
   * @param value The value to check against
   * @returns The callback function
   */
  protected static operatorForWhere(key: string, operator: string, value: any): (item: any, index: string) => boolean {
    return (item: any, _index: string) => {
      const retrieved = this.get(item, key)

      switch (operator) {
        case '=':
        case '==': return retrieved === value
        case '!=':
        case '<>': return retrieved !== value
        case '<': return retrieved < value
        case '>': return retrieved > value
        case '<=': return retrieved <= value
        case '>=': return retrieved >= value
        case '===': return retrieved === value
        case '!==': return retrieved !== value
        default: return retrieved === value
      }
    }
  }

  /**
   * Run a filter over each of the items
   *
   * @param items The items to filter
   * @param callback The callback function
   * @returns The filtered items
   */
  protected static filter(items: CountryList, callback?: (item: any, index: string) => boolean): CountryList {
    if (!callback) {
      return Object.entries(items)
        .filter(([_, value]) => !!value)
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {} as CountryList)
    }

    return Object.entries(items)
      .filter(([key, value]) => callback(value, key))
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {} as CountryList)
  }

  /**
   * Get an item from an array or object using "dot" notation
   *
   * @param target The target object
   * @param key The key to get
   * @param defaultValue The default value
   * @returns The value
   */
  protected static get(target: any, key: string | string[], defaultValue: any = null): any {
    if (key === null) {
      return target
    }

    const segments = Array.isArray(key) ? key : key.split('.')
    let current = target

    for (const segment of segments) {
      if (segment === '*') {
        if (!Array.isArray(current) && typeof current !== 'object') {
          return typeof defaultValue === 'function' ? defaultValue() : defaultValue
        }

        const result = this.pluck(current, segments.slice(segments.indexOf(segment) + 1))
        return segments.includes('*') ? this.collapse(result) : result
      }

      if (Array.isArray(current) || typeof current === 'object') {
        if (Object.prototype.hasOwnProperty.call(current, segment)) {
          current = current[segment]
        }
        else {
          return typeof defaultValue === 'function' ? defaultValue() : defaultValue
        }
      }
      else {
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue
      }
    }

    return current
  }

  /**
   * Pluck an array of values from an array
   *
   * @param array The array to pluck from
   * @param value The value to pluck
   * @param key The key to use
   * @returns The plucked values
   */
  protected static pluck(array: any[], value: string | string[], key: string | string[] | null = null): any {
    const results: any = {}
    const valuePath = typeof value === 'string' ? value.split('.') : value
    const keyPath = key === null || Array.isArray(key) ? key : key.split('.')

    for (const item of array) {
      const itemValue = this.get(item, valuePath)

      if (key === null) {
        results.push(itemValue)
      }
      else {
        const itemKey = this.get(item, keyPath as string | string[])
        results[itemKey] = itemValue
      }
    }

    return results
  }

  /**
   * Collapse an array of arrays into a single array
   *
   * @param array The array to collapse
   * @returns The collapsed array
   */
  protected static collapse(array: any[]): any[] {
    const results: any[] = []

    for (const values of array) {
      if (!Array.isArray(values)) {
        continue
      }

      results.push(...values)
    }

    return results
  }

  /**
   * Get contents of the given file path
   *
   * @param filePath The file path
   * @returns The file contents
   * @throws CountryLoaderException if the file does not exist
   */
  protected static getFile(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw CountryLoaderException.invalidCountry()
    }

    return fs.readFileSync(filePath, 'utf8')
  }
}
