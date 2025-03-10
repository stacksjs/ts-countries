import type { CountryAttributes, CountryDivision, Translation } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Country class for handling country-specific data and operations
 */
export class Country {
  /**
   * The attributes object containing all country data
   */
  protected attributes: CountryAttributes

  /**
   * Create a new Country instance
   *
   * @param attributes Country attributes
   * @throws Error if mandatory attributes are missing
   */
  constructor(attributes: CountryAttributes) {
    // Set the attributes
    this.attributes = attributes

    // Check required mandatory attributes
    if (!this.getName() || !this.getOfficialName()
      || !this.getNativeName() || !this.getNativeOfficialName()
      || !this.getIsoAlpha2() || !this.getIsoAlpha3()) {
      throw new Error('Missing mandatory country attributes!')
    }
  }

  /**
   * Set the attributes
   *
   * @param attributes Country attributes
   * @returns this instance for chaining
   */
  public setAttributes(attributes: CountryAttributes): Country {
    this.attributes = attributes
    return this
  }

  /**
   * Get the attributes
   *
   * @returns The country attributes
   */
  public getAttributes(): CountryAttributes | null {
    return this.attributes
  }

  /**
   * Set a single attribute
   *
   * @param key The attribute key
   * @param value The attribute value
   * @returns this instance for chaining
   */
  public set(key: string, value: any): Country {
    this.attributes = this.setNestedProperty(this.attributes, key, value)
    return this
  }

  /**
   * Helper method to set a nested property using dot notation
   */
  private setNestedProperty(obj: any, path: string, value: any): any {
    const copy = { ...obj }
    const parts = path.split('.')
    let current = copy

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {}
      }
      current = current[part]
    }

    current[parts[parts.length - 1]] = value
    return copy
  }

  /**
   * Get an item from attributes using dot notation
   *
   * @param key The attribute key
   * @param defaultValue Default value if key doesn't exist
   * @returns The attribute value or default
   */
  public get(key: string | null, defaultValue: any = null): any {
    if (key === null) {
      return this.attributes
    }

    // Check if key exists at top level
    if (Object.prototype.hasOwnProperty.call(this.attributes, key)) {
      return this.attributes[key as keyof CountryAttributes] ?? defaultValue
    }

    // Handle dot notation
    let result: any = this.attributes
    const segments = key.split('.')

    for (const segment of segments) {
      if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, segment)) {
        result = result[segment]
      }
      else {
        return defaultValue
      }
    }

    return result
  }

  /**
   * Get the common name
   *
   * @returns The common name
   */
  public getName(): string | null {
    const name = this.get('name')
    if (typeof name === 'string') {
      return name
    }
    return this.get('name.common') || null
  }

  /**
   * Get the official name
   *
   * @returns The official name
   */
  public getOfficialName(): string | null {
    return this.get('name.official') || this.get('official_name') || null
  }

  /**
   * Get the given native name or fallback to first native name
   *
   * @param languageCode Optional language code
   * @returns The native name
   */
  public getNativeName(languageCode?: string | null): string | null {
    const langCode = languageCode ? languageCode.toLowerCase() : null

    if (langCode) {
      const nativeName = this.get(`name.native.${langCode}.common`)
      if (nativeName)
        return nativeName
    }

    const nativeNames = this.get('name.native')
    if (nativeNames && typeof nativeNames === 'object') {
      const firstLang = Object.keys(nativeNames)[0]
      if (firstLang && nativeNames[firstLang]?.common) {
        return nativeNames[firstLang].common
      }
    }

    return this.get('native_name') || null
  }

  /**
   * Get the given native official name or fallback to first native official name
   *
   * @param languageCode Optional language code
   * @returns The native official name
   */
  public getNativeOfficialName(languageCode?: string | null): string | null {
    const langCode = languageCode ? languageCode.toLowerCase() : null

    if (langCode) {
      const nativeOfficialName = this.get(`name.native.${langCode}.official`)
      if (nativeOfficialName)
        return nativeOfficialName
    }

    const nativeNames = this.get('name.native')
    if (nativeNames && typeof nativeNames === 'object') {
      const firstLang = Object.keys(nativeNames)[0]
      if (firstLang && nativeNames[firstLang]?.official) {
        return nativeNames[firstLang].official
      }
    }

    return this.get('native_official_name') || null
  }

  /**
   * Get the native names
   *
   * @returns The native names
   */
  public getNativeNames(): Record<string, Translation> | null {
    return this.get('name.native') || null
  }

  /**
   * Get the demonym
   *
   * @returns The demonym
   */
  public getDemonym(): string | null {
    return this.get('demonym') || null
  }

  /**
   * Get the capital
   *
   * @returns The capital
   */
  public getCapital(): string | null {
    return this.get('capital') || null
  }

  /**
   * Get the ISO 3166-1 alpha2
   *
   * @returns The ISO 3166-1 alpha2 code
   */
  public getIsoAlpha2(): string | null {
    return this.get('iso_3166_1_alpha2') || null
  }

  /**
   * Get the ISO 3166-1 alpha3
   *
   * @returns The ISO 3166-1 alpha3 code
   */
  public getIsoAlpha3(): string | null {
    return this.get('iso_3166_1_alpha3') || null
  }

  /**
   * Get the ISO 3166-1 numeric
   *
   * @returns The ISO 3166-1 numeric code
   */
  public getIsoNumeric(): string | null {
    return this.get('iso_3166_1_numeric') || null
  }

  /**
   * Get the given currency or fallback to first currency
   *
   * @param currency Optional currency code
   * @returns The currency details
   */
  public getCurrency(currency?: string | null): Record<string, any> | null {
    const currencyCode = currency ? currency.toUpperCase() : null

    if (currencyCode) {
      const currencyDetails = this.get(`currency.${currencyCode}`)
      if (currencyDetails)
        return currencyDetails
    }

    const currencies = this.get('currency')
    if (currencies && typeof currencies === 'object') {
      const firstCurrency = Object.keys(currencies)[0]
      if (firstCurrency) {
        return currencies[firstCurrency]
      }
    }

    return null
  }

  /**
   * Get all currencies
   *
   * @returns All currencies
   */
  public getCurrencies(): Record<string, any> {
    return this.get('currency', {})
  }

  /**
   * Get the TLD
   *
   * @returns The top level domain
   */
  public getTld(): string | null {
    const tlds = this.get('tld')
    return Array.isArray(tlds) && tlds.length > 0 ? tlds[0] : null
  }

  /**
   * Get the TLDs
   *
   * @returns The top level domains
   */
  public getTlds(): string[] | null {
    return this.get('tld') || null
  }

  /**
   * Get the alternative spellings
   *
   * @returns The alternative spellings
   */
  public getAltSpellings(): string[] | null {
    return this.get('alt_spellings') || null
  }

  /**
   * Get the given language or fallback to first language
   *
   * @param languageCode Optional language code
   * @returns The language
   */
  public getLanguage(languageCode?: string | null): string | null {
    const langCode = languageCode ? languageCode.toLowerCase() : null

    if (langCode) {
      const language = this.get(`languages.${langCode}`)
      if (language)
        return language
    }

    const languages = this.get('languages')
    if (languages && typeof languages === 'object') {
      const firstLang = Object.keys(languages)[0]
      if (firstLang) {
        return languages[firstLang]
      }
    }

    return null
  }

  /**
   * Get all languages
   *
   * @returns All languages
   */
  public getLanguages(): Record<string, string> {
    return this.get('languages', {})
  }

  /**
   * Get the translations
   *
   * @returns The translations
   */
  public getTranslations(): Record<string, Translation> {
    // Get english name
    const name: Record<string, Translation> = {
      eng: {
        common: this.getName() || '',
        official: this.getOfficialName() || '',
      },
    }

    // Get native names
    const natives = this.getNativeNames() || {}

    // Get other translations
    let translations: Record<string, Translation> = {}
    const isoAlpha2 = this.getIsoAlpha2()

    if (isoAlpha2) {
      const filePath = path.join(__dirname, '..', 'resources', 'translations', `${isoAlpha2.toLowerCase()}.json`)
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8')
          translations = JSON.parse(fileContent)
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (error) {
          // Silently fail if file can't be read or parsed
        }
      }
    }

    // Merge all names together
    const result = { ...translations, ...natives, ...name }

    // Sort alphabetically
    return Object.keys(result)
      .sort()
      .reduce((acc: Record<string, Translation>, key) => {
        acc[key] = result[key]
        return acc
      }, {})
  }

  /**
   * Get the translation
   *
   * @param languageCode Optional language code
   * @returns The translation
   */
  public getTranslation(languageCode?: string | null): Translation {
    const translations = this.getTranslations()

    if (languageCode && translations[languageCode]) {
      return translations[languageCode]
    }

    // Fallback to first translation
    const firstLang = Object.keys(translations)[0]
    return translations[firstLang]
  }

  /**
   * Get the geodata
   *
   * @returns The geodata
   */
  public getGeodata(): Record<string, any> | null {
    return this.get('geo') || null
  }

  /**
   * Get the continent
   *
   * @returns The continent
   */
  public getContinent(): string[] | null {
    return this.get('geo.continent') || null
  }

  /**
   * Determine whether the country uses postal code
   *
   * @returns Whether the country uses postal code
   */
  public usesPostalCode(): boolean | null {
    return this.get('geo.postal_code') || null
  }

  /**
   * Get the latitude
   *
   * @returns The latitude
   */
  public getLatitude(): string | null {
    return this.get('geo.latitude') || null
  }

  /**
   * Get the longitude
   *
   * @returns The longitude
   */
  public getLongitude(): string | null {
    return this.get('geo.longitude') || null
  }

  /**
   * Get the described latitude
   *
   * @returns The described latitude
   */
  public getLatitudeDesc(): string | null {
    return this.get('geo.latitude_desc') || null
  }

  /**
   * Get the described longitude
   *
   * @returns The described longitude
   */
  public getLongitudeDesc(): string | null {
    return this.get('geo.longitude_desc') || null
  }

  /**
   * Get the maximum latitude
   *
   * @returns The maximum latitude
   */
  public getMaxLatitude(): string | null {
    return this.get('geo.max_latitude') || null
  }

  /**
   * Get the maximum longitude
   *
   * @returns The maximum longitude
   */
  public getMaxLongitude(): string | null {
    return this.get('geo.max_longitude') || null
  }

  /**
   * Get the minimum latitude
   *
   * @returns The minimum latitude
   */
  public getMinLatitude(): string | null {
    return this.get('geo.min_latitude') || null
  }

  /**
   * Get the minimum longitude
   *
   * @returns The minimum longitude
   */
  public getMinLongitude(): string | null {
    return this.get('geo.min_longitude') || null
  }

  /**
   * Get the area
   *
   * @returns The area
   */
  public getArea(): number | null {
    return this.get('geo.area') || null
  }

  /**
   * Get the region
   *
   * @returns The region
   */
  public getRegion(): string | null {
    return this.get('geo.region') || null
  }

  /**
   * Get the subregion
   *
   * @returns The subregion
   */
  public getSubregion(): string | null {
    return this.get('geo.subregion') || null
  }

  /**
   * Get the world region
   *
   * @returns The world region
   */
  public getWorldRegion(): string | null {
    return this.get('geo.world_region') || null
  }

  /**
   * Get the region code
   *
   * @returns The region code
   */
  public getRegionCode(): string | null {
    return this.get('geo.region_code') || null
  }

  /**
   * Get the subregion code
   *
   * @returns The subregion code
   */
  public getSubregionCode(): string | null {
    return this.get('geo.subregion_code') || null
  }

  /**
   * Check the landlock status
   *
   * @returns Whether the country is landlocked
   */
  public isLandlocked(): boolean | null {
    return this.get('geo.landlocked') || null
  }

  /**
   * Get the borders
   *
   * @returns The borders
   */
  public getBorders(): string[] | null {
    return this.get('geo.borders') || null
  }

  /**
   * Determine whether the country is independent
   *
   * @returns Whether the country is independent
   */
  public isIndependent(): string | null {
    return this.get('geo.independent') || null
  }

  /**
   * Get the given calling code or fallback to first calling code
   *
   * @returns The calling code
   */
  public getCallingCode(): string | null {
    const diallingCodes = this.get('dialling.calling_code')
    if (Array.isArray(diallingCodes) && diallingCodes.length > 0) {
      return diallingCodes[0]
    }

    const callingCodes = this.get('calling_code')
    if (Array.isArray(callingCodes) && callingCodes.length > 0) {
      return callingCodes[0]
    }

    return null
  }

  /**
   * Get the calling codes
   *
   * @returns The calling codes
   */
  public getCallingCodes(): string[] | null {
    return this.get('dialling.calling_code') || null
  }

  /**
   * Get the national prefix
   *
   * @returns The national prefix
   */
  public getNationalPrefix(): string | null {
    return this.get('dialling.national_prefix') || null
  }

  /**
   * Get the national number length
   *
   * @returns The national number length
   */
  public getNationalNumberLength(): number | null {
    const lengths = this.get('dialling.national_number_lengths')
    return Array.isArray(lengths) && lengths.length > 0 ? lengths[0] : null
  }

  /**
   * Get the national number lengths
   *
   * @returns The national number lengths
   */
  public getNationalNumberLengths(): number[] | null {
    return this.get('dialling.national_number_lengths') || null
  }

  /**
   * Get the national destination code length
   *
   * @returns The national destination code length
   */
  public getNationalDestinationCodeLength(): number | null {
    const lengths = this.get('dialling.national_destination_code_lengths')
    return Array.isArray(lengths) && lengths.length > 0 ? lengths[0] : null
  }

  /**
   * Get the national destination code lengths
   *
   * @returns The national destination code lengths
   */
  public getNationalDestinationCodeLengths(): number[] | null {
    return this.get('dialling.national_destination_code_lengths') || null
  }

  /**
   * Get the international prefix
   *
   * @returns The international prefix
   */
  public getInternationalPrefix(): string | null {
    return this.get('dialling.international_prefix') || null
  }

  /**
   * Get the extras
   *
   * @returns The extras
   */
  public getExtra(): Record<string, any> | null {
    return this.get('extra') || null
  }

  /**
   * Get the geonameid
   *
   * @returns The geonameid
   */
  public getGeonameid(): number | null {
    return this.get('extra.geonameid') || null
  }

  /**
   * Get the edgar code
   *
   * @returns The edgar code
   */
  public getEdgar(): string | null {
    return this.get('extra.edgar') || null
  }

  /**
   * Get the itu code
   *
   * @returns The itu code
   */
  public getItu(): string | null {
    return this.get('extra.itu') || null
  }

  /**
   * Get the marc code
   *
   * @returns The marc code
   */
  public getMarc(): string | null {
    return this.get('extra.marc') || null
  }

  /**
   * Get the wmo code
   *
   * @returns The wmo code
   */
  public getWmo(): string | null {
    return this.get('extra.wmo') || null
  }

  /**
   * Get the ds code
   *
   * @returns The ds code
   */
  public getDs(): string | null {
    return this.get('extra.ds') || null
  }

  /**
   * Get the fifa code
   *
   * @returns The fifa code
   */
  public getFifa(): string | null {
    return this.get('extra.fifa') || null
  }

  /**
   * Get the fips code
   *
   * @returns The fips code
   */
  public getFips(): string | null {
    return this.get('extra.fips') || null
  }

  /**
   * Get the gaul code
   *
   * @returns The gaul code
   */
  public getGaul(): number | null {
    return this.get('extra.gaul') || null
  }

  /**
   * Get the ioc code
   *
   * @returns The ioc code
   */
  public getIoc(): string | null {
    return this.get('extra.ioc') || null
  }

  /**
   * Get the cowc code
   *
   * @returns The cowc code
   */
  public getCowc(): string | null {
    return this.get('extra.cowc') || null
  }

  /**
   * Get the cown code
   *
   * @returns The cown code
   */
  public getCown(): number | null {
    return this.get('extra.cown') || null
  }

  /**
   * Get the fao code
   *
   * @returns The fao code
   */
  public getFao(): number | null {
    return this.get('extra.fao') || null
  }

  /**
   * Get the imf code
   *
   * @returns The imf code
   */
  public getImf(): number | null {
    return this.get('extra.imf') || null
  }

  /**
   * Get the ar5 code
   *
   * @returns The ar5 code
   */
  public getAr5(): string | null {
    return this.get('extra.ar5') || null
  }

  /**
   * Get the address format
   *
   * @returns The address format
   */
  public getAddressFormat(): string | null {
    return this.get('extra.address_format') || null
  }

  /**
   * Determine whether the country is EU member
   *
   * @returns Whether the country is EU member
   */
  public isEuMember(): boolean | null {
    return this.get('extra.eu_member') || null
  }

  /**
   * Determine whether the country has data protection
   *
   * @returns The data protection status
   */
  public getDataProtection(): string | null {
    return this.get('extra.data_protection') || null
  }

  /**
   * Get the VAT rates
   *
   * @returns The VAT rates
   */
  public getVatRates(): Record<string, any> | null {
    return this.get('extra.vat_rates') || null
  }

  /**
   * Get the emoji
   *
   * @returns The emoji
   */
  public getEmoji(): string | null {
    return this.get('extra.emoji') || this.get('emoji') || null
  }

  /**
   * Get the geographic data structure
   *
   * @returns The GeoJSON data
   */
  public getGeoJson(): string | null {
    const code = this.getIsoAlpha2()
    if (!code) {
      return null
    }

    const filePath = path.join(__dirname, '..', 'resources', 'geodata', `${code.toLowerCase()}.json`)
    if (fs.existsSync(filePath)) {
      try {
        return fs.readFileSync(filePath, 'utf8')
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return null
      }
    }

    return null
  }

  /**
   * Get the flag
   *
   * @returns The SVG flag
   */
  public getFlag(): string | null {
    const code = this.getIsoAlpha2()
    if (!code) {
      return null
    }

    const filePath = path.join(__dirname, '..', 'resources', 'flags', `${code.toLowerCase()}.svg`)
    if (fs.existsSync(filePath)) {
      try {
        return fs.readFileSync(filePath, 'utf8')
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return null
      }
    }

    return null
  }

  /**
   * Get the divisions
   *
   * @returns The divisions
   */
  public getDivisions(): Record<string, CountryDivision> | null {
    const code = this.getIsoAlpha2()
    if (!code) {
      return null
    }

    const filePath = path.join(__dirname, '..', 'resources', 'divisions', `${code.toLowerCase()}.json`)
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContent)
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (error) {
        return null
      }
    }

    return null
  }

  /**
   * Get a specific division
   *
   * @param division The division code
   * @returns The division details
   */
  public getDivision(division: string): CountryDivision | null {
    const divisions = this.getDivisions()
    if (!divisions) {
      return null
    }

    return divisions[division] || null
  }

  /**
   * Get the timezones
   *
   * @returns The timezones
   */
  public getTimezones(): string[] | undefined {
    const code = this.getIsoAlpha2()
    if (!code) {
      return undefined
    }

    try {
      // This is a simplified version as TypeScript doesn't have direct access to DateTimeZone::listIdentifiers
      // In a real implementation, you might use a library like moment-timezone
      return []
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      return undefined
    }
  }

  /**
   * Get the locales
   *
   * @returns The locales
   */
  public getLocales(): string[] | undefined {
    const code = this.getIsoAlpha2()
    if (!code) {
      return undefined
    }

    try {
      // This is a simplified version as TypeScript doesn't have direct access to ResourceBundle::getLocales
      // In a real implementation, you might use a library like Intl
      return []
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      return undefined
    }
  }
}
