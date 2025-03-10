import type { Country } from './Country'

export class CountryCollection {
  private countries: Country[]

  constructor(countries: Country[]) {
    this.countries = countries
  }

  where(property: string, operator: string | any, value?: any): Country[] {
    if (value === undefined) {
      value = operator
      operator = '=='
    }

    return this.countries.filter((country) => {
      const propertyValue = this.getNestedProperty(country, property)

      // Handle undefined values
      if (propertyValue === undefined) {
        return false
      }

      // Convert values to strings for comparison if needed
      const strPropertyValue = propertyValue.toString()
      const strCompareValue = value.toString()

      switch (operator) {
        case '==':
          return propertyValue === value
        case '!=':
          return propertyValue !== value
        case '>':
          return strPropertyValue > strCompareValue
        case '<':
          return strPropertyValue < strCompareValue
        case '>=':
          return strPropertyValue >= strCompareValue
        case '<=':
          return strPropertyValue <= strCompareValue
        default:
          return false
      }
    })
  }

  private getNestedProperty(obj: Country, path: string): any {
    // Special handling for Country instance methods
    if (path === 'geo.region') {
      return obj.getRegion()
    }
    if (path === 'name.native.eng.common') {
      const nativeNames = obj.getNativeNames()
      return nativeNames?.eng?.common
    }
    if (path === 'iso_3166_1_numeric') {
      return obj.getIsoNumeric()
    }

    // For other properties, use the dot notation traversal
    return path.split('.').reduce((current: any, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key]
      }
      return undefined
    }, obj as any)
  }
}
