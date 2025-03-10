import type { CountryAttributes, CountryList } from '../src/types'
import { beforeAll, describe, expect, it } from 'bun:test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { countries, country } from '../src'
import { Country } from '../src/Country'
import { CountryCollection } from '../src/CountryCollection'
import { CountryLoader } from '../src/CountryLoader'

const mockUSA: CountryAttributes = {
  name: {
    common: 'United States',
    official: 'United States of America',
    native: {
      eng: {
        common: 'United States',
        official: 'United States of America',
      },
    },
  },
  iso_3166_1_alpha2: 'US',
  iso_3166_1_alpha3: 'USA',
  iso_3166_1_numeric: '840',
  currency: {
    USD: {
      name: 'United States dollar',
      symbol: '$',
    },
  },
  languages: {
    eng: 'English',
  },
  geo: {
    region: 'Americas',
    subregion: 'North America',
    continent: ['North America'],
    region_code: 'NA',
  },
}

const mockShortList: CountryList = {
  US: mockUSA,
  GB: {
    name: {
      common: 'United Kingdom',
      official: 'United Kingdom of Great Britain and Northern Ireland',
      native: {
        eng: {
          common: 'United Kingdom',
          official: 'United Kingdom of Great Britain and Northern Ireland',
        },
      },
    },
    iso_3166_1_alpha2: 'GB',
    iso_3166_1_alpha3: 'GBR',
    iso_3166_1_numeric: '826',
    languages: {
      eng: 'English',
    },
    geo: {
      region: 'Europe',
      subregion: 'Northern Europe',
      continent: ['Europe'],
      region_code: 'EU',
    },
  },
}

describe('ts-countries', () => {
  beforeAll(() => {
    // Ensure the resources/data directory exists
    const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write mock data files
    fs.writeFileSync(path.join(dataDir, 'us.json'), JSON.stringify(mockUSA))
    fs.writeFileSync(path.join(dataDir, 'shortlist.json'), JSON.stringify(mockShortList))
    fs.writeFileSync(path.join(dataDir, 'longlist.json'), JSON.stringify(mockShortList))
  })

  describe('country()', () => {
    it('should load a country by its ISO code', () => {
      const usa = country('US') as Country
      expect(usa).toBeInstanceOf(Country)
      expect(usa.getName()).toBe('United States')
      expect(usa.getIsoAlpha2()).toBe('US')
      expect(usa.getIsoAlpha3()).toBe('USA')
    })

    it('should return raw data when hydrate is false', () => {
      const usa = country('US', false) as CountryAttributes
      expect(usa).toBeObject()
      expect(usa).not.toBeInstanceOf(Country)
      expect(usa.iso_3166_1_alpha2).toBe('US')
      expect(usa.iso_3166_1_alpha3).toBe('USA')
    })

    it('should throw an error for invalid country code', () => {
      expect(() => country('XX')).toThrow('Country code may be misspelled, invalid, or data not found on server!')
    })
  })

  describe('countries()', () => {
    it('should load all countries in short list format', () => {
      const allCountries = countries() as CountryList
      expect(allCountries).toBeObject()
      expect(Object.keys(allCountries).length).toBe(2)
      expect(allCountries.US).toBeDefined()
      expect(allCountries.GB).toBeDefined()
      expect(allCountries.US.iso_3166_1_alpha2).toBe('US')
      expect(allCountries.GB.iso_3166_1_alpha2).toBe('GB')
    })

    it('should return hydrated Country instances when hydrate is true', () => {
      const allCountries = countries(false, true) as Country[]
      expect(Array.isArray(allCountries)).toBe(true)
      expect(allCountries.length).toBe(2)
      expect(allCountries[0]).toBeInstanceOf(Country)
      expect(allCountries[1]).toBeInstanceOf(Country)
    })

    it('should cache results for subsequent calls', () => {
      const firstCall = countries()
      const secondCall = countries()
      expect(firstCall).toBe(secondCall) // Should return the same cached object
    })
  })

  describe('where()', () => {
    it('should filter countries by exact value match', () => {
      const collection = new CountryCollection(countries(false, true) as Country[])
      const europeCountries = collection.where('geo.region', 'Europe')
      expect(europeCountries.length).toBe(1)
      expect(europeCountries[0].getName()).toBe('United Kingdom')

      const americasCountries = collection.where('geo.region', 'Americas')
      expect(americasCountries.length).toBe(1)
      expect(americasCountries[0].getName()).toBe('United States')
    })

    it('should filter countries by inequality', () => {
      const collection = new CountryCollection(countries(false, true) as Country[])
      const nonEuropeanCountries = collection.where('geo.region', '!=', 'Europe')
      expect(nonEuropeanCountries.length).toBe(1)
      expect(nonEuropeanCountries[0].getName()).toBe('United States')
    })

    it('should filter countries by comparison operators', () => {
      const collection = new CountryCollection(countries(false, true) as Country[])
      const numericCodeComparison = collection.where('iso_3166_1_numeric', '>', '800')
      expect(numericCodeComparison.length).toBe(2)
      expect(numericCodeComparison.map((c: Country) => c.getIsoNumeric())).toEqual(['840', '826'])
    })

    it('should filter countries using dot notation', () => {
      const collection = new CountryCollection(countries(false, true) as Country[])
      const englishNativeCountries = collection.where('name.native.eng.common', 'United Kingdom')
      expect(englishNativeCountries.length).toBe(1)
      expect(englishNativeCountries[0].getIsoAlpha2()).toBe('GB')
    })

    it('should handle non-existent properties', () => {
      const collection = new CountryCollection(countries(false, true) as Country[])
      const noResults = collection.where('nonexistent.property', 'any value')
      expect(noResults.length).toBe(0)

      const noResultsComparison = collection.where('nonexistent.property', '>', '100')
      expect(noResultsComparison.length).toBe(0)
    })
  })

  describe('Country instance methods', () => {
    it('should get native names correctly', () => {
      const usa = country('US') as Country
      const nativeNames = usa.getNativeNames()
      expect(nativeNames).toBeDefined()
      expect(nativeNames?.eng?.common).toBe('United States')
      expect(nativeNames?.eng?.official).toBe('United States of America')
    })

    it('should get currency information', () => {
      const usa = country('US') as Country
      const currencies = usa.getCurrencies()
      expect(currencies).toBeDefined()
      expect(currencies?.USD).toBeDefined()
      expect(currencies?.USD?.name).toBe('United States dollar')
      expect(currencies?.USD?.symbol).toBe('$')
    })

    it('should get language information', () => {
      const usa = country('US') as Country
      const languages = usa.getLanguages()
      expect(languages).toBeDefined()
      expect(languages?.eng).toBe('English')
    })

    it('should get geographic information', () => {
      const usa = country('US') as Country
      expect(usa.getRegion()).toBe('Americas')
      expect(usa.getSubregion()).toBe('North America')
      const continent = usa.getContinent()
      expect(continent).toBeDefined()
      expect(continent).toEqual(['North America'])
      expect(usa.getRegionCode()).toBe('NA')
    })

    it('should handle missing optional properties', () => {
      const countryWithoutOptionals = new Country({
        name: {
          common: 'Test Country',
          official: 'Test Country Official',
          native: {
            eng: {
              common: 'Test Country',
              official: 'Test Country Official',
            },
          },
        },
        iso_3166_1_alpha2: 'TC',
        iso_3166_1_alpha3: 'TCO',
        iso_3166_1_numeric: '999',
        geo: {
          region: 'Test Region',
          subregion: 'Test Subregion',
          continent: ['Test Continent'],
          region_code: 'TR',
        },
      })

      expect(countryWithoutOptionals.getCurrencies()).toEqual({})
      expect(countryWithoutOptionals.getLanguages()).toEqual({})
    })

    it('should get alternative names and spellings', () => {
      const usa = country('US') as Country
      expect(usa.getDemonym()).toBeDefined()
      expect(usa.getCapital()).toBeDefined()
      expect(usa.getAltSpellings()).toBeDefined()
    })

    it('should handle translations', () => {
      const usa = country('US') as Country
      const translations = usa.getTranslations()
      expect(translations).toBeDefined()
      expect(translations.eng).toBeDefined()
      expect(translations.eng.common).toBe('United States')
      expect(translations.eng.official).toBe('United States of America')

      const translation = usa.getTranslation('eng')
      expect(translation).toBeDefined()
      expect(translation.common).toBe('United States')
      expect(translation.official).toBe('United States of America')
    })

    it('should handle detailed geographic information', () => {
      const usa = country('US') as Country
      const geodata = usa.getGeodata()
      expect(geodata).toBeDefined()
      expect(geodata?.region).toBe('Americas')
      expect(geodata?.subregion).toBe('North America')

      // Test geographic coordinate methods
      expect(usa.getLatitude()).toBeDefined()
      expect(usa.getLongitude()).toBeDefined()
      expect(usa.getLatitudeDesc()).toBeDefined()
      expect(usa.getLongitudeDesc()).toBeDefined()
      expect(usa.getMaxLatitude()).toBeDefined()
      expect(usa.getMaxLongitude()).toBeDefined()
      expect(usa.getMinLatitude()).toBeDefined()
      expect(usa.getMinLongitude()).toBeDefined()
      expect(usa.getArea()).toBeDefined()
      expect(usa.getWorldRegion()).toBeDefined()
      expect(usa.getSubregionCode()).toBeDefined()
      expect(usa.isLandlocked()).toBeDefined()
      expect(usa.getBorders()).toBeDefined()
      expect(usa.isIndependent()).toBeDefined()
    })

    it('should handle dialing codes and phone number information', () => {
      const usa = country('US') as Country
      expect(usa.getCallingCode()).toBeDefined()
      expect(usa.getCallingCodes()).toBeDefined()
      expect(usa.getNationalPrefix()).toBeDefined()
      expect(usa.getNationalNumberLength()).toBeDefined()
      expect(usa.getNationalNumberLengths()).toBeDefined()
      expect(usa.getNationalDestinationCodeLength()).toBeDefined()
      expect(usa.getNationalDestinationCodeLengths()).toBeDefined()
      expect(usa.getInternationalPrefix()).toBeDefined()
    })

    it('should handle extra metadata', () => {
      const usa = country('US') as Country
      const extra = usa.getExtra()
      expect(extra).toBeDefined()

      // Test various code getters
      expect(usa.getGeonameid()).toBeDefined()
      expect(usa.getEdgar()).toBeDefined()
      expect(usa.getItu()).toBeDefined()
      expect(usa.getMarc()).toBeDefined()
      expect(usa.getWmo()).toBeDefined()
      expect(usa.getDs()).toBeDefined()
      expect(usa.getFifa()).toBeDefined()
      expect(usa.getFips()).toBeDefined()
      expect(usa.getGaul()).toBeDefined()
      expect(usa.getIoc()).toBeDefined()
      expect(usa.getCowc()).toBeDefined()
      expect(usa.getCown()).toBeDefined()
      expect(usa.getFao()).toBeDefined()
      expect(usa.getImf()).toBeDefined()
      expect(usa.getAr5()).toBeDefined()
    })

    it('should handle address and formatting information', () => {
      const usa = country('US') as Country
      expect(usa.getAddressFormat()).toBeDefined()
      expect(usa.isEuMember()).toBeDefined()
      expect(usa.getDataProtection()).toBeDefined()
      expect(usa.getVatRates()).toBeDefined()
      expect(usa.getEmoji()).toBeDefined()
    })

    it('should handle TLD information', () => {
      const usa = country('US') as Country
      const tld = usa.getTld()
      expect(tld).toBeDefined()

      const tlds = usa.getTlds()
      if (tlds) {
        expect(Array.isArray(tlds)).toBe(true)
      }
      else {
        expect(tlds).toBeNull()
      }
    })

    it('should handle resource files', () => {
      const usa = country('US') as Country

      // Test GeoJSON data
      const geoJson = usa.getGeoJson()
      expect(geoJson).toBeDefined()

      // Test flag data
      const flag = usa.getFlag()
      expect(flag).toBeDefined()

      // Test divisions data
      const divisions = usa.getDivisions()
      expect(divisions).toBeDefined()

      if (divisions) {
        const firstDivisionKey = Object.keys(divisions)[0]
        const division = usa.getDivision(firstDivisionKey)
        expect(division).toBeDefined()
      }
    })

    it('should handle locale and timezone information', () => {
      const usa = country('US') as Country

      const timezones = usa.getTimezones()
      expect(timezones).toBeDefined()
      if (timezones) {
        expect(Array.isArray(timezones)).toBe(true)
      }

      const locales = usa.getLocales()
      expect(locales).toBeDefined()
      if (locales) {
        expect(Array.isArray(locales)).toBe(true)
      }
    })

    it('should handle attribute manipulation', () => {
      const usa = country('US') as Country

      // Test setting and getting attributes
      const newAttribute = { test: 'value' }
      usa.set('test', newAttribute)
      expect(usa.get('test')).toEqual(newAttribute)

      // Test getting nested attributes with dot notation
      expect(usa.get('name.common')).toBe('United States')
      expect(usa.get('geo.region')).toBe('Americas')

      // Test getting with default value
      expect(usa.get('nonexistent', 'default')).toBe('default')

      // Test getting all attributes
      const attributes = usa.getAttributes()
      expect(attributes).toBeDefined()
      expect(attributes?.name).toBeDefined()
      expect(attributes?.iso_3166_1_alpha2).toBe('US')
    })
  })

  describe('data validation', () => {
    it('should validate required fields on country creation', () => {
      // Missing native names
      expect(() => new Country({
        name: {
          common: 'Test Country',
          official: 'Test Country Required',
        },
        iso_3166_1_alpha2: 'TC',
        iso_3166_1_alpha3: 'TCO',
        iso_3166_1_numeric: '999',
        geo: {
          region: 'Test Region',
          subregion: 'Test Subregion',
          continent: ['Test Continent'],
          region_code: 'TR',
        },
      } as unknown as CountryAttributes)).toThrow('Missing mandatory country attributes!')

      // Valid country with all required fields
      expect(() => new Country({
        name: {
          common: 'Test Country',
          official: 'Test Country Official',
          native: {
            eng: {
              common: 'Test Country',
              official: 'Test Country Official',
            },
          },
        },
        iso_3166_1_alpha2: 'TC',
        iso_3166_1_alpha3: 'TCO',
        iso_3166_1_numeric: '999',
        geo: {
          region: 'Test Region',
          subregion: 'Test Subregion',
          continent: ['Test Continent'],
          region_code: 'TR',
        },
      })).not.toThrow()
    })

    it('should handle malformed JSON data', () => {
      const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
      const malformedFile = path.join(dataDir, 'malformed.json')

      // Create malformed JSON file
      fs.writeFileSync(malformedFile, '{ "invalid": JSON')

      expect(() => CountryLoader.country('malformed')).toThrow()

      // Clean up
      fs.unlinkSync(malformedFile)
    })

    it('should handle missing files', () => {
      expect(() => CountryLoader.country('xx')).toThrow('Country code may be misspelled, invalid, or data not found on server!')
    })

    it('should handle invalid country codes', () => {
      expect(() => CountryLoader.country('123')).toThrow()
      expect(() => CountryLoader.country('')).toThrow()
      expect(() => CountryLoader.country('toolong')).toThrow()
    })

    it('should handle empty data sets', () => {
      const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
      const emptyFile = path.join(dataDir, 'empty.json')

      // Create empty JSON file
      fs.writeFileSync(emptyFile, '{}')

      expect(() => CountryLoader.country('empty')).toThrow()

      // Clean up
      fs.unlinkSync(emptyFile)
    })
  })

  describe('caching behavior', () => {
    it('should cache individual country data', () => {
      // First call should read from file
      const firstCall = CountryLoader.country('US')

      // Modify the file to ensure we're reading from cache
      const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
      const originalContent = fs.readFileSync(path.join(dataDir, 'us.json'), 'utf8')
      fs.writeFileSync(path.join(dataDir, 'us.json'), '{}')

      // Second call should read from cache
      const secondCall = CountryLoader.country('US')

      expect(secondCall).toEqual(firstCall)

      // Restore original content
      fs.writeFileSync(path.join(dataDir, 'us.json'), originalContent)
    })

    it('should cache country lists', () => {
      // First call should read from file
      const firstCall = CountryLoader.countries()

      // Modify the file to ensure we're reading from cache
      const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
      const originalContent = fs.readFileSync(path.join(dataDir, 'shortlist.json'), 'utf8')
      fs.writeFileSync(path.join(dataDir, 'shortlist.json'), '{}')

      // Second call should read from cache
      const secondCall = CountryLoader.countries()

      expect(secondCall).toBe(firstCall)

      // Restore original content
      fs.writeFileSync(path.join(dataDir, 'shortlist.json'), originalContent)
    })

    it('should handle cache invalidation', () => {
      // First call to cache the data
      const firstCall = CountryLoader.countries()

      // Modify the data to test cache invalidation
      const modifiedData = {
        US: {
          name: {
            common: 'Modified United States',
            official: 'United States of America',
            native: {
              eng: {
                common: 'Modified United States',
                official: 'United States of America',
              },
            },
          },
          iso_3166_1_alpha2: 'US',
          iso_3166_1_alpha3: 'USA',
          iso_3166_1_numeric: '840',
          currency: {
            USD: {
              name: 'United States dollar',
              symbol: '$',
            },
          },
          languages: {
            eng: 'English',
          },
          geo: {
            region: 'Americas',
            subregion: 'North America',
            continent: ['North America'],
            region_code: 'NA',
          },
        },
      }

      const dataDir = path.join(process.cwd(), 'src', 'resources', 'data')
      const originalContent = fs.readFileSync(path.join(dataDir, 'shortlist.json'), 'utf8')
      fs.writeFileSync(path.join(dataDir, 'shortlist.json'), JSON.stringify(modifiedData))

      // Force cache invalidation by clearing the module cache
      // @ts-expect-error Accessing private static member for testing
      CountryLoader.countryCache = {}

      // Second call should read from file again with modified data
      const secondCall = CountryLoader.countries() as CountryList

      // Restore original content
      fs.writeFileSync(path.join(dataDir, 'shortlist.json'), originalContent)

      const name = secondCall.US.name as { common: string }
      expect(name.common).toBe('Modified United States')
      expect(firstCall).not.toEqual(secondCall)
    })

    it('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }).fill(null).map(() => {
        return new Promise((resolve) => {
          resolve(CountryLoader.country('US'))
        })
      })

      const results = await Promise.all(promises)
      const firstResult = results[0]

      results.forEach((result) => {
        expect(result).toEqual(firstResult)
      })
    })

    it('should maintain cache consistency', () => {
      // Clear the cache before testing consistency
      // @ts-expect-error Accessing private static member for testing
      CountryLoader.countryCache = {}

      const countryData = CountryLoader.country('US', false) as CountryAttributes
      const countriesData = CountryLoader.countries() as CountryList

      expect(countriesData.US).toEqual(countryData)
    })
  })
})
